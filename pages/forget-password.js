import React from "react";
import Link from "next/link";
import useForm from "react-hook-form";

import usePublicPage from "../lib/use-public-page";
import { Services } from "../lib/with-services";

import LeftArrow from "../static/left-arrow.svg";

async function forgetPasswordApi(api, { email }) {
  let result;
  try {
    result = await api
      .post(api.normalizeUrl(`/api/user/forget-password`), {
        json: { email },
        throwHttpErrors: false,
      })
      .json();
  } catch (e) {
    console.error(e);
  }

  return result;
}

const ForgetPasswordForm = () => {
  const [success, setSuccess] = React.useState();
  const services = React.useContext(Services);
  const { handleSubmit, register, errors, setError } = useForm();
  const onSubmit = async (values) => {
    const result = await forgetPasswordApi(services.api, values);

    if (result.error) {
      setError("afterSubmit", "", result.error);
      return;
    }

    setSuccess("Na e-mailovou adresu byl odeslán odkaz pro obnovu hesla.");
  };

  if (success) {
    return (
      <div className="border-solid header-border-color border-t p-3 mb-3">
        <h3 className="header-text-color text-lg font-bold mb-3">{success}</h3>
      </div>
    );
  }

  return (
    <div className="border-solid header-border-color border-t p-3 mb-3">
      <h3 className="header-text-color text-lg font-bold mb-3">
        Obnovení zapomenutého hesla
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="my-4">
          Zadejte e-mailovou adresu, ke které jste zapomněli své heslo.
        </p>
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
        <div className="my-2 text-red-600">
          <span>{errors.email && errors.email.message}</span>
          <p>
            <span>{errors.afterSubmit && errors.afterSubmit.message}</span>
          </p>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="p-3 btn block w-full font-bold text-white rounded"
          >
            ODESLAT
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

export default function ForgetPassword() {
  usePublicPage();

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <ForgetPasswordForm />
    </div>
  );
}
