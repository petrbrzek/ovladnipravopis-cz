import React from "react";
import useForm from "react-hook-form";
import { useDispatch } from "redux-react-hook";
import Router from "next/router";
import Link from "next/link";

import { Services } from "../lib/with-services";

import Fox from "../static/fox.svg";

export async function login(api, { email, password }) {
  let result;
  try {
    result = await api
      .post(api.normalizeUrl(`/api/user/login`), {
        json: { password, email },
        throwHttpErrors: false,
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
  const onSubmit = async (values) => {
    const result = await login(services.api, values);

    if (result.error) {
      setError("afterSubmit", "", "E-mail nebo heslo je špatně");
      return;
    }

    dispatch({
      type: "USER:LOGGED_IN",
      loggedIn: true,
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
              message: "E-mail má špatný formát.",
            },
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
            minLength: 4,
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
        <div className="mt-2">
          <button
            type="submit"
            className="p-3 btn block w-full font-bold text-white rounded"
          >
            PŘIHLÁSIT SE
          </button>
        </div>
        <p className="mt-4 header-text-color font-semibold text-center">
          <Link href="/forget-password">
            <a>Zapomenuté heslo?</a>
          </Link>
        </p>
      </form>
    </div>
  );
};

function Header() {
  return (
    <div className="sticky top-0 w-full flex items-center overflow-hidden header-bg px-3">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold leading-none">
          Ovládni <br />
          pravopis.cz
        </h1>
        <p className="header-text-color pt-3 text-xss font-bold">
          Vymýtit, nebo vymítit pravopisné chyby?
        </p>
      </div>
      <div className="flex flex-1 mt-2">
        <Fox className="flex ml-auto pt-3" />
      </div>
    </div>
  );
}

export default function PublicHomepage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <div className="p-3 text-xs">
        <p className="header-text-color font-semibold leading-loose">
          Pravopis dokáže člověka dost potrápit, nezvládnutý pravopis dokonce
          ztrapnit. Říká se ale, těžko na cvičišti, lehko na bojišti. Aplikace
          Ovládni pravopis je prostorem pro trénink.
          <br />
          <br />
          Tak hodně zdaru! :)
        </p>
      </div>

      <LoginForm />

      <div className="p-3 border-solid header-border-color border-t">
        <h3 className="header-text-color text-lg font-bold mb-3">
          Ještě nemáte účet?
        </h3>
        <Link href="/signup">
          <button
            type="submit"
            className="p-3 btn btn-light block w-full font-bold text-white rounded"
          >
            REGISTRACE
          </button>
        </Link>
      </div>

      <div
        className="flex flex-1 px-3 pt-3 pb-5 mt-1 text-xs border-solid header-border-color border-t"
        style={{
          background: "url(/static/fox-left-side.svg) bottom right no-repeat",
        }}
      >
        <p className="header-text-color font-semibold leading-loose">
          Máte nápad na zlepšení? 🙂Napište mi na adresu:
          <a href="mailto:sarka.brzkova@lauder.cz"> sarka.brzkova@lauder.cz </a>
          •
          <Link href="/legal/terms-and-conditions">
            <a> Všeobecné obchodní podmínky </a>
          </Link>
          •
          <Link href="/legal/privacy-policy">
            <a> Zásady ochrany osobních údajů </a>
          </Link>
        </p>
      </div>
    </div>
  );
}
