import React from "react";

function Quote({ pic, name, para }) {
  return (
    <div className="bg-soft flex items-center w-9/19 max-lg:w-full justify-between p-2 rounded-xl">
      <div className=" w-24 h-24 overflow-hidden rounded-full border-2 border-primary">
        <img
          className="w-full h-full object-cover object-left"
          src={pic}
          alt=""
        />
      </div>
      <div className="w-8/12 md:w-9/12 lg:w-2/3 text-lg">
        <h4 className="text-paragraph">{name}</h4>
        <q>{para}</q>
      </div>
    </div>
  );
}

export default Quote;
