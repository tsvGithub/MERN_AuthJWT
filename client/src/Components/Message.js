import React from "react";

const getStyle = (props) => {
  //start bootstrap class
  let baseClass = "alert ";
  //append Error class
  if (props.message.msgError) baseClass = baseClass + "alert-danger";
  //append not an Error
  else baseClass = baseClass + "alert-primary";
  //
  return baseClass + " text-center";
};

//  (7)
const Message = (props) => {
  //dinamic className + state message from Login component
  return (
    <div className={getStyle(props)} role="alert">
      {props.message.msgBody}
    </div>
  );
};

export default Message;
