import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Contacts from "../components/Contacts";

const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-[#f9f9f9]">
      <Header />

      <main className="flex flex-1 overflow-hidden pt-16">
        <div className="grid grid-cols-[283.5px_1fr_283.5px] gap-10 w-full h-full">
          <aside className="border-r border-gray-100 bg-white h-full overflow-y-auto">
            <Sidebar />
          </aside>

          <section className="h-full overflow-y-auto">
            <Feed />
          </section>

          <aside className="border-l border-gray-100 bg-white h-full overflow-y-auto">
            <Contacts />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Home;
