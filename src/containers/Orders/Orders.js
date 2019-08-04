import React, { Component } from "react";
import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Orders extends Component {
  state = {
    orders: [],
    loading: true,
    isMounted: false
  };

  componentDidMount() {
    axios
      .get("/orders.json ")
      .then(res => {
        console.log(res.data);

        const fetchedOrders = [];

        for (let key in res.data) {
          fetchedOrders.push({ ...res.data[key], id: key });
        }

        this.setState({ loading: false, orders: fetchedOrders });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  render() {
    console.log(this.state.orders);

    return (
      <div>
        {this.state.orders.map(order => (
          <Order
            key={order.id}
            price={order.price}
            ingredients={order.ingredients}
          />
        ))}
      </div>
    );
  }
}

export default withErrorHandler(Orders, axios);