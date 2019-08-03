import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummray";
import { Route } from "react-router-dom";
import CheckoutData from "../Checkout/ContactData/ContactData";

class Checkout extends Component {
  state = {
    ingredients: null,
    price: 0
  };

  componentWillMount() {
    console.log(this.props);
    const query = new URLSearchParams(this.props.location.search);

    const ingredients = {};
    let price = 0;

    for (let param of query.entries()) {
      if (param[0] === "price") {
        price = param[1];
      } else {
        ingredients[param[0]] = +param[1];
      }
    }

    this.setState({
      ingredients: ingredients,
      totalPrice: price
    });
  }

  checkoutCancelHandler = () => {
    this.props.history.goBack();
  };
  checkoutContinueHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients}
          checkoutCancel={this.checkoutCancelHandler}
          checkoutContinue={this.checkoutContinueHandler}
        />
        Contact Data
        <Route
          path={this.props.match.path + "/contact-data"}
          render={() => (
            <CheckoutData
              ingredients={this.state.ingredients}
              price={this.state.totalPrice}
            />
          )}
        />
      </div>
    );
  }
}

export default Checkout;
