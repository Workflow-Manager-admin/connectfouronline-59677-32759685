import { component$ } from "@builder.io/qwik";
import { ConnectFourGame } from "../components/connectfour/connectfour";

// PUBLIC_INTERFACE
export default component$(() => {
  return <ConnectFourGame />;
});

export const head = {
  title: "4 IN LINE: Connect Four Game",
  meta: [
    {
      name: "description",
      content: "Play Connect Four (4 IN LINE) online with a modern Qwik UI!",
    },
  ],
};
