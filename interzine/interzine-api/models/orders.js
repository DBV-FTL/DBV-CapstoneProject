const db = require("../db");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");
const { validateFields } = require("../utils/validate");

class Orders {
  static async addOrder({ item, user }) {
    const { product_name, service_provider_id, quantity, date } = item;
    const requiredItems = ["product_name", "quantity", "date"];

    //Checks to see if the item is an array, if an array, maps through the array of objects and validates each field
    if (Array.isArray(item)) {
      item?.map((item) => {
        try {
          validateFields({
            required: requiredItems,
            obj: item,
            location: "add order",
          });
        } catch (err) {
          throw err;
        }
      });
    } else {
      try {
        validateFields({
          required: requiredItems,
          obj: item,
          location: "add order",
        });
      } catch (err) {
        throw err;
      }
    }

    if (user?.client && user?.client === "provider")
      throw new UnauthorizedError("User is a Provider");
    const order_id = await this.createOrderNumber({ user, item });
    const sp_id = await this.getServiceProviderId({ item });

    let orderDetails = [];
    try {
      if (Array.isArray(item)) {
        // const orderDetail  s = []
        await Promise.all(
          item?.map(async (item) => {
            const result = await db.query(
              `
                SELECT id, cost, image_url FROM menu_items
                WHERE name = $1 AND service_provider_id = $2`,
              [item.product_name, item.service_provider_id]
            );
            const item_id = result.rows[0].id;
            const item_cost = result.rows[0].cost;
            const item_image_url = result.rows[0].image_url;

            const r = await db.query(
              `
                INSERT INTO order_details (product_name, quantity, menu_item_id, order_id, cost, image_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
              [
                item.product_name,
                item.quantity,
                item_id,
                order_id,
                item_cost,
                item_image_url,
              ]
            );

            orderDetails = [...orderDetails, r.rows[0]];
          })
        );

        return orderDetails;
      } else {
        const result = await db.query(
          `
            SELECT id FROM menu_items
            WHERE name = $1 AND service_provider_id = $2`,
          [product_name, service_provider_id]
        );
        const item_id = result.rows[0].id;

        const r = await db.query(
          `
            INSERT INTO order_details (product_name, quantity, menu_item_id, order_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
          [product_name, quantity, item_id, order_id]
        );

        orderDetails = [...orderDetails, r.rows[0]];
        return orderDetails;
      }
    } catch (err) {
      throw err;
    }
  }

  static async getServiceProviderId({ item }) {
    const result = await db.query(
      `
    SELECT service_provider_id FROM menu_items
    WHERE name = $1`,
      [item.product_name]
    );
  }
  static async createOrderNumber({ user, item }) {
    const result = await db.query(
      `
        INSERT INTO orders (user_id, provider_id, date)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [user.id, item[0].service_provider_id, item[0].date]
    );
    return result.rows[0].id;
  }

  static async listProviderOrders({ user }) {
    if (user?.client && user?.client === "user")
      throw new UnauthorizedError("User is unauthorized");
    const result = await db.query(
      `
      SELECT * from orders as o
      RIGHT JOIN order_details as od
      ON o.id = od.order_id
      WHERE o.provider_id = $1
      ORDER BY o.id DESC`,
      [user.id]
    );

    return result.rows;
  }
  static async listOrders({ user }) {
    if (user?.client && user?.client === "provider")
      throw new UnauthorizedError("User is a Provider");
    const result = await db.query(
      `
        SELECT * from orders as o
        RIGHT JOIN order_details as od
        ON o.id = od.order_id
        WHERE o.user_id = $1
        ORDER BY o.id DESC`,
      [user.id]
    );
    return result.rows;
  }
}

module.exports = Orders;
