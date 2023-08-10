import axios from 'axios';

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl;
    this.token = null;
    this.tokenName = "interzine_token";
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem(this.tokenName, token);
  }

 async request({ endpoint, method = "GET", data = {}, headers = {"Content-Type":"application/json"}}) {
    console.log('in request')
    console.log('headers', headers)
    console.log('data', data)
    
    const url = `${this.remoteHostUrl}/${endpoint}`;
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    try {
      console.log('res incoming')
      const result = await axios({ url, method, data, headers });
      console.log('res', result)
      return { data: result.data, error: null, status: result.status };
    } catch (err) {
      console.error({ errorResponse: err.response });
      const message = err?.response?.data?.error?.message;
      return { data: null, error: message || String(err) };
    }
  }

  async loginUser(creds) {
     return await this.request({
      endpoint: "auth/user/login",
      method: "POST",
      data: creds,
    });
  
  }
  async loginProvider(creds) {
    return await this.request({
     endpoint: "auth/provider/login",
     method: "POST",
     data: creds,
   });
  
 }
  async signupUser(creds) {
    console.log('signing up')
    console.log("user creds", creds)
    return await this.request({
      endpoint: "auth/user/register",
      method: "POST",
      data: creds,
    });
    
  }

  async signupProvider(creds) {
    console.log('signing up', creds)
    return await this.request({
      endpoint: "auth/provider/register",
      method: "post",
      data: creds,
      headers: {"Content-Type": "multipart/form-data"}
    });
  }

  async logoutUser() {
    this.setToken(null);
    localStorage.setItem(this.tokenName, "");
  }

  async logoutProvider() {
    this.setToken(null);
    localStorage.setItem(this.tokenName, "");
  }

  async addNewItem(creds) {
    console.log('new item!!', creds)
    return await this.request({
      endpoint: "menu/create",
      method: "POST",
      data: creds,
      headers: {"Content-Type": "multipart/form-data"}
    });
  }

  async fetchMenuItems(id){
    return await this.request({endpoint: `menu/${id}`});
  }

  async fetchMenuItem(id) {
    return await this.request({ endpoint: `menu/food/${id}` });
  }

  async fetchServicesByZip(){
    return await this.request({endpoint: `auth/user`});
  }


  async fetchUserFromToken(){
    return await this.request({
      endpoint: "auth/verify",
      method: "POST",
      data: {},
    });
  }

  async computeCart(cart, menus){
    return await this.request({
      endpoint: "cart/totalCost",
      method: "POST",
      data: {cart, menus},
    })
  }

  async fetchPaymentIntent(){
    return await this.request({endpoint: "payment/create-payment-intent", method: "POST"})
  }

  async checkoutFoods(item){
    return await this.request({
      endpoint: "orders/create",
      method: "POST",
      data: {item},
    })
  }

  async fetchOrders(){
    return await this.request({
      endpoint: 'orders/previous'
    })
  }

  async fetchOrdersReceived(){
    return await this.request({
      endpoint: 'orders/provider-previous'
    })
  }

  
  async fetchUserById(id){
    return await this.request({
      endpoint: `auth/user/${id}`
    })
  }

  async fetchProviderByEmail(email){
    return await this.request({
      endpoint: "auth/provider/email",
      method: "POST",
      data: {email},
    })
  }

  async updateProviderProfile(data){
    return await this.request({
      endpoint: "auth/provider/update",
      method: "PUT",
      data: data,
      headers: {"Content-Type":"multipart/form-data"}
    })
  }
 
  async submitPhoto(form){
    return await this.request({
      endpoint: "auth/provider/photo",
      method: "POST",
      data: form,
      headers: {"Content-Type": "multipart/form-data"}
    })
  }


}
export default new ApiClient("https://intersine-backend.onrender.com");