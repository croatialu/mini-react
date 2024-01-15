import React from "../core/React";

const Header = ({ title }) => {
  return (
    <div className="flex justify-between bg-red py-2 px-4">
      <div className="text-3xl font-bold">{title}</div>
      <div>Right</div>
    </div>
  );
};

console.log(
  <div>
123asd
    {[1,2,3,4,5]}
    123123
  </div>,
  'aaaaa'
)

export default Header;
