import React from "react";
import Link from "next/link";
import Router from "next/router";
import useForm from "react-hook-form";

import usePublicPage from "../lib/use-public-page";
import { Services } from "../lib/with-services";

import LeftArrow from "../static/left-arrow.svg";

async function resetPasswordApi(api, { password, token }) {
  let result;
  try {
    result = await api
      .post(api.normalizeUrl(`/api/user/reset-password`), {
        json: { password, token },
        throwHttpErrors: false,
      })
      .json();
  } catch (e) {
    console.error(e);
  }

  return result;
}

const ResetPasswordForm = ({ token }) => {
  const [success, setSuccess] = React.useState();
  const services = React.useContext(Services);
  const { handleSubmit, register, errors, setError } = useForm();
  const onSubmit = async (values) => {
    const result = await resetPasswordApi(services.api, values);

    if (result.error) {
      setError("afterSubmit", "", result.error);
      return;
    }

    setSuccess("Vaše heslo bylo změněno. Budete přesměrováni na přihlášení.");

    setTimeout(() => {
      Router.replace("/");
    }, 2500);
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
        <label htmlFor="password" className="header-text-color block font-bold">
          Vaše nové heslo
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
            <span>Heslo musí mít minimálně 4 znaky</span>
          )}
        </p>

        <input
          type="hidden"
          id="token"
          name="token"
          value={token}
          ref={register({ required: false })}
        />

        <p className="py-2 text-red-600">
          {errors.afterSubmit && errors.afterSubmit.message}
        </p>
        <div className="mt-6">
          <button
            type="submit"
            className="p-3 btn block w-full font-bold text-white rounded"
          >
            OBNOVIT HESLO
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

export default function ResetPassword({ token }) {
  usePublicPage();

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <ResetPasswordForm token={token} />
    </div>
  );
}

ResetPassword.getInitialProps = async ({ query }) => {
  const { token } = query;

  return { token };
};
