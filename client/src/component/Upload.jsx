import React, { useState } from "react";

function Upload() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState (null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file.data);
    const response = await fetch("http://localhost:8000/upload-to-google-drive", {
      method: "POST",
      body: formData,
    });
    const responseWithBody = await response.json();
    if (response) {
        console.log(responseWithBody)
        setUrl("File Uploaded SuccessFully");
    }
  };
  const handleFileChange = (e) => {
    const file = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setFile(file);
  };
  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" onChange={handleFileChange}></input>
      <button type="submit">Submit</button>
    </form>
        {url}
    </>
  );
}
export default Upload;