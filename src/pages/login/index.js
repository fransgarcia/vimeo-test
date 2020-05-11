import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Formik, Form, Field } from "formik";
import {
  ProgressBar,
  Button,
  Tooltip,
  Intent,
  FormGroup,
  Card,
  Elevation,
  Classes,
  Alignment
} from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { InputGroup } from "formik-blueprint";
import PropTypes from "prop-types";
import { showToast } from "store/actions/toast";
import { signin } from "store/actions/auth";
import withToast from "hoc/withToast";

const validateSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(8, "Length must be at least 8 letters!")
    .max(50, "Length must be less than 50 letters!")
    .required("Required")
});

const SignIn = props => {
  const { signin, showToast } = props;
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const handleSubmit = (values, actions) => {
    signin({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        history.push("/dashboard");
        showToast({
          message: "You are successfully logged in!",
          intent: "success"
        });
      },
      fail: err => {
        actions.setSubmitting(false);
        showToast({ message: err.response.data, intent: "danger" });
      }
    });
  };

  const lockButton = (
    <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
      <Button
        icon={showPassword ? "unlock" : "lock"}
        intent={Intent.WARNING}
        minimal={true}
        onClick={() => setShowPassword(!showPassword)}
      />
    </Tooltip>
  );

  return (
    <Card
      className={classNames(Classes.DARK, Classes.HOTKEY_COLUMN)}
      interactive={true}
      elevation={Elevation.TWO}
      style={{ width: "30rem" }}
    >
      <Formik
        onSubmit={handleSubmit}
        initialValues={{ email: "", password: "" }}
        validationSchema={validateSchema}
      >
        {({
          submitForm,
          isSubmitting,
          errors: { email: emailError, password: passwordError }
        }) => {
          return (
            <Form>
              <FormGroup
                helperText={emailError}
                intent={emailError ? Intent.DANGER : Intent.NONE}
                label="Email Address"
                labelFor="email"
              >
                <Field
                  component={InputGroup}
                  placeholder="Email Address (required)"
                  id="email"
                  name="email"
                  type="email"
                  intent={emailError ? Intent.DANGER : Intent.NONE}
                  label="Email Address"
                  large
                />
              </FormGroup>
              <FormGroup
                helperText={passwordError}
                intent={passwordError ? Intent.DANGER : Intent.NONE}
                label="Password"
                labelFor="password"
              >
                <Field
                  component={InputGroup}
                  intent={passwordError ? Intent.DANGER : Intent.NONE}
                  placeholder="Password (required)"
                  id="password"
                  name="password"
                  rightElement={lockButton}
                  type={showPassword ? "text" : "password"}
                  large
                />
              </FormGroup>
              {isSubmitting && <ProgressBar />}
              <br />
              <Button
                className={classNames(Classes.INTENT_PRIMARY, Classes.LARGE)}
                disabled={isSubmitting}
                onClick={submitForm}
                icon="log-in"
                align={Alignment.RIGHT}
              >
                Sign In
              </Button>
              <Button
                className={classNames(
                  Classes.MINIMAL,
                  Classes.TEXT_SMALL,
                  Classes.NAVBAR_GROUP,
                  Classes.ALIGN_RIGHT
                )}
                onClick={() => history.push("/signup")}
              >
                Sign up here
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
};

SignIn.propTypes = {
  signin: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.auth.error
});

const mapDispatchToProps = {
  signin: signin,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(SignIn)
);
