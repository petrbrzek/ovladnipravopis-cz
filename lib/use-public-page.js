import { useRouter } from "next/router";
import { useDispatch } from "redux-react-hook";

export default function usePublicPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  dispatch({
    type: "PUBLIC_PAGE:ADD",
    pathname: router.pathname
  });
}
