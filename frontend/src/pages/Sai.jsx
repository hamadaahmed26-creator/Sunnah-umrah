import React from "react";
import Counter from "./Counter";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";

export default function Sai() {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);
  return <Counter kind="sai" title={t("saiCounter")} total={7} />;
}
