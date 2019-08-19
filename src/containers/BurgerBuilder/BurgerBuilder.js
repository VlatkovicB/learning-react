import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

// Redux
import { connect } from "react-redux";
//import * as actonTypes from "../../store/actions/actionTypes";
import * as burgerBuilderActions from "../../store/actions/index";

/* Moved to the reducer
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.2,
  bacon: 0.7,
  onion: 0.2
};
*/

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 5,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    // https://react-burger-lover.firebaseio.com

    this.props.onInitIngredients();
    console.log(this.props.ingredients);
    /* Moved to Redux   
      axios
      .get("/ingredients.json")
      .then(r => {
        this.setState({ ingredients: r.data });
      })
      .catch(err => {
        this.setState({ error: true });
      });
      */
  }

  purchaseHadler = () => {
    this.setState({ purchasing: true });
  };

  purchaseHandlerCancel = () => {
    this.setState({ purchasing: false });
  };

  /* Not needed no pass params as query thanks to Redux
  purchaseContinueHandler = () => {
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(i) +
          "=" +
          encodeURIComponent(this.state.ingredients[i])
      );
    }

    queryParams.push("price=" + this.state.totalPrice);

    const queryString = queryParams.join("&");

    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString
    });
  };*/

  purchaseContinueHandler = () => {
    this.props.history.push("/checkout");
  };

  // Local UI state
  updatePurchaseState = ingredients => {
    // don't update
    //const ingredients = {...this.state.ingredients};

    const sum = Object.keys(ingredients)
      .map(key => {
        return ingredients[key];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    //this.setState({ purchasable: sum > 0 });
    return sum > 0;
  };

  /*
  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCounted = oldCount + 1;
    const updateIngredients = { ...this.state.ingredients };

    updateIngredients[type] = updatedCounted;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({
      ingredients: updateIngredients,
      totalPrice: newPrice
    });

    this.updatePurchaseState(updateIngredients);
  };*/

  /*
  removeIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];

    if (oldCount <= 0) {
      return;
    }

    const updatedCounted = oldCount - 1;
    const updateIngredients = { ...this.state.ingredients };

    updateIngredients[type] = updatedCounted;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({
      ingredients: updateIngredients,
      totalPrice: newPrice
    });

    this.updatePurchaseState(updateIngredients);
  };
  */

  render() {
    const disabledInfo = { ...this.props.ings };

    // this will replace numbers with true or false
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummaryHTML = null;

    if (this.state.loading) {
      orderSummaryHTML = <Spinner />;
    }

    let burgerHTML = this.props.error ? <p>Application error</p> : <Spinner />;

    if (this.props.ings) {
      burgerHTML = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            price={this.props.price}
            ingredientAdded={this.props.onIngredentAdded}
            ingredientRemoved={this.props.onIngredentRemove}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHadler}
          />
        </Aux>
      );

      orderSummaryHTML = (
        <OrderSummary
          finalPrice={this.props.price}
          ingredients={this.props.ings}
          purchaseCancel={this.purchaseHandlerCancel}
          purchaseContinue={this.purchaseContinueHandler}
        />
      );
    }

    if (this.state.loading) {
      orderSummaryHTML = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          modalClosed={this.purchaseHandlerCancel}
          show={this.state.purchasing}
        >
          {orderSummaryHTML}
        </Modal>
        {burgerHTML}
      </Aux>
    );
  }
}

const mapsStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredentAdded: ingName =>
      dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredentRemove: ingName =>
      dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngridients())
  };
};

export default connect(
  mapsStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
