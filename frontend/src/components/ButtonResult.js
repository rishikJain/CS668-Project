import React from "react";

export default ({ data, reset, defaultValues }) => (
  <>
    {data && (
      <pre style={{ textAlign: "left" }}>{JSON.stringify(data, null, 2)}</pre>
    )}
    
    <button className="button">submit</button>
  </>
);
