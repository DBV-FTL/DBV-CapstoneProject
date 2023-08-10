const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../utils/errors");
const { validateFields } = require("../utils/validate");

class MenuItem {
  static async addMenuItem({ item, provider, image_name }) {
    const { name, cost} = item;
    const requiredItems = ["name", "cost"];

    try {
      validateFields({
        required: requiredItems,
        obj: item,
        location: "menu item",
      });
    } catch (err) {
      throw err;
    }

    //Checks if the user is a provider, if not, an error is thrown
    if (provider.client !== "provider") throw new UnauthorizedError("User is not a service provider")

    //Checks to see if item exists for that service provider, if it does, an error is thrown
    const check = await db.query(`
    SELECT * FROM menu_items
    WHERE name = $1 AND service_provider_id = $2`, [name, provider.id])
    if (check.rows[0]) throw new BadRequestError("Menu item already exists")

    const result = await db.query(`
    INSERT INTO menu_items
    (name, image_url, cost, service_provider_id)
    VALUES ($1, $2, $3, (SELECT id FROM service_providers WHERE email = $4))
    RETURNING id, name, image_url, cost, service_provider_id `,
    [name, image_name, cost, provider.email])
    const newMenuItem = result.rows[0];
    return newMenuItem;
  }

  static async listMenuItems(id) {
    try {
        const result = await db.query(`
        SELECT *
        FROM menu_items
        WHERE service_provider_id = $1`,[id]);
        const menuItems = result.rows;
        return menuItems
    } catch(err) {
        throw new err

    }
  }

  static async fetchMenuItem(id) {
    try {
        const result = await db.query(`
        SELECT *
        FROM menu_items
        WHERE id = $1`,[id]);
        const menuItems = result.rows[0];
        return menuItems
    } catch(err) {
        throw new err

    }
  }
}

module.exports = MenuItem;
