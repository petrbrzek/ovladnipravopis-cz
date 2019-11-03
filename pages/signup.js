import React from "react";
import Link from "next/link";
import Router from "next/router";
import useForm from "react-hook-form";
import { useDispatch } from "redux-react-hook";

import { Services } from "../lib/with-services";

import LeftArrow from "../static/left-arrow.svg";
import { login } from "../components/public-homepage";

async function signup(api, { email, password }) {
  let result;
  try {
    result = await api
      .post(api.normalizeUrl(`/api/user/signup`), {
        json: { password, email },
        throwHttpErrors: false
      })
      .json();
  } catch (e) {
    console.error(e);
  }

  return result;
}

const SignupForm = () => {
  const services = React.useContext(Services);
  const dispatch = useDispatch();
  const { handleSubmit, register, errors, setError } = useForm();
  const onSubmit = async values => {
    const result = await signup(services.api, values);

    if (result.error) {
      setError("afterSubmit", "", result.error);
      return;
    }

    await login(services.api, values);

    dispatch({
      type: "USER:LOGGED_IN",
      loggedIn: true
    });
    Router.replace("/");
  };

  return (
    <div className="border-solid header-border-color border-t p-3 mb-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="header-text-color block font-bold">
          E-mail
        </label>
        <input
          className="border-gray-400 p-3 mb-2 border-solid border block w-full text-xs rounded"
          name="email"
          id="email"
          type="email"
          ref={register({
            required: "E-mail je povinný",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "E-mail má špatný formát."
            }
          })}
        />
        <p className="my-2 text-red-600">
          {errors.email && errors.email.message}
        </p>

        <label htmlFor="password" className="header-text-color block font-bold">
          Heslo
        </label>
        <input
          className="border-gray-400 p-3 mb-2 border-solid border block w-full text-xs rounded"
          name="password"
          id="password"
          type="password"
          ref={register({
            required: "Heslo je povinné",
            minLength: 4
          })}
        />
        <p className="my-2 text-red-600">
          {errors.password && errors.password.message}
        </p>
        <p className="my-2 text-red-600">
          {errors.password && errors.password.type == "minLength" && (
            <span>Heslo musi mit minimalne 4 znaky</span>
          )}
        </p>

        <p className="py-2 text-red-600">
          {errors.afterSubmit && errors.afterSubmit.message}
        </p>
        <div className="mt-6">
          <button
            type="submit"
            className="p-3 btn block w-full font-bold text-white rounded"
          >
            ZAREGISTROVAT SE
          </button>
        </div>
      </form>
    </div>
  );
};

function Header() {
  return (
    <div className="sticky top-0 w-full flex items-center overflow-hidden header-bg px-3">
      <Link href={`/`}>
        <div className="flex flex-col">
          <div className="flex flex-1">
            <LeftArrow />
            <div className=" justify-center p-2 px-3">
              <h1 className="text-base font-bold leading-tight">Zpět</h1>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <SignupForm />
    </div>
  );
}
