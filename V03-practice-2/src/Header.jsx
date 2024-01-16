import React from "../core/React";

const Header = ({ title }) => {
  return (
    <div className="flex justify-between bg-red py-2 px-4">
      <div className="text-3xl font-bold">{title}</div>
      <div>Right</div>
    </div>
  );
};


export default Header;
