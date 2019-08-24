import React from "react";
import useForm from "react-hook-form";
import { useDispatch } from "redux-react-hook";
import Router from "next/router";

import { Services } from "../lib/with-services";

async function login(api, { email, password }) {
  let result;
  try {
    result = await api
      .post(`${process.env.API_ENDPOINT}/api/user/login`, {
        json: { password, email },
        throwHttpErrors: false
      })
      .json();
  } catch (e) {
    console.error(e);
  }

  return result;
}

const LoginForm = () => {
  const services = React.useContext(Services);
  const dispatch = useDispatch();
  const { handleSubmit, register, errors, setError } = useForm();
  const onSubmit = async values => {
    const result = await login(services.api, values);

    if (result.error) {
      setError("afterSubmit", "", "E-mail nebo heslo je spatne");
      return;
    }

    dispatch({
      type: "USER:LOGGED_IN",
      loggedIn: true
    });
    Router.replace("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">E-mail</label>
      <input
        className="border-gray-400 border-solid border"
        name="email"
        id="email"
        ref={register({
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "invalid email address"
          }
        })}
      />
      <p>{errors.email && errors.email.message}</p>

      <label htmlFor="password">Heslo</label>
      <input
        className="border-gray-400 border-solid border"
        name="password"
        id="password"
        ref={register({
          required: "Password is required",
          minLength: 4
        })}
      />
      <p>{errors.password && errors.password.message}</p>
      <p>
        {errors.password && errors.password.type == "minLength" && (
          <span>Heslo musi mit minimalne 4 znaky</span>
        )}
      </p>

      <p>{errors.afterSubmit && errors.afterSubmit.message}</p>

      <button type="submit">Submit</button>
    </form>
  );
};

export default function PublicHomepage() {
  return (
    <div>
      <h1>Homepage</h1>

      <LoginForm />
    </div>
  );
}
