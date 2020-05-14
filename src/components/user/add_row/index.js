import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import {
  Button,
  Dialog,
  Intent,
  Classes,
  FormGroup,
  ProgressBar
} from "@blueprintjs/core";
import { handleNumberChange } from "@blueprintjs/docs-theme";
import _ from "lodash-es";
import { createRecord, getRecords } from "store/actions/record";
import { showToast } from "store/actions/toast";
import { USER_FIELDS } from "constants/index";

const AddRow = props => {
  const { createRecord, params, getRecords, showToast } = props;
  const [isOpen, toggleDialog] = useState(false);
  const [value, setValue] = useState(0);
  const handleValueChange = handleNumberChange(value => setValue(value));

  const fieldList = ["firstName", "lastName", "email", "password", "role"];

  const validation = {};
  _.toPairs(_.pick(USER_FIELDS, fieldList)).map(
    a => (validation[a[0]] = _.get(a[1], "validate", null))
  );
  const validateSchema = Yup.object().shape(validation);

  const handleSubmit = (values, actions) => {
    createRecord({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        getRecords({ params });
        showToast({
          message: "Successfully added one row to table!",
          intent: Intent.SUCCESS,
          timeout: 3000
        });
        toggleDialog(false);
      },
      fail: err => {
        actions.setSubmitting(false);
        showToast({
          message: err.response.data,
          intent: Intent.DANGER
        });
      }
    });
  };

  const initialValue = {};
  _.toPairs(_.pick(USER_FIELDS, fieldList)).map(
    a => (initialValue[a[0]] = _.get(a[1], "initialValue", ""))
  );

  const passToProps = {
    onChange: handleValueChange,
    selectedValue: value
  };

  return (
    <>
      <Button icon="add" onClick={() => toggleDialog(true)}>
        Add User
      </Button>
      <Dialog
        icon="add"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Add User"
      >
        <div className={Classes.DIALOG_BODY}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={{ ...initialValue }}
            validationSchema={validateSchema}
          >
            {({ submitForm, isSubmitting, errors }) => {
              return (
                <Form>
                  {fieldList.map(field => {
                    return (
                      <FormGroup
                        helperText={errors[field]}
                        intent={errors[field] ? Intent.DANGER : Intent.NONE}
                        label={USER_FIELDS[field].form_label}
                        labelFor={USER_FIELDS[field].id}
                      >
                        <Field
                          {...USER_FIELDS[field]}
                          {...(field === "role" ? passToProps : null)}
                        />
                      </FormGroup>
                    );
                  })}
                  {isSubmitting && <ProgressBar />}
                  <br />
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={() => toggleDialog(false)} />
                    <Button
                      icon="add"
                      intent={Intent.PRIMARY}
                      onClick={submitForm}
                      text="Add"
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = state => ({
  params: state.record.params
});

const mapDispatchToProps = {
  createRecord: createRecord,
  getRecords: getRecords,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(AddRow);