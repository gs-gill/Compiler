import { useState, useEffect } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Editor from "@monaco-editor/react";
import { encode } from "base-64";
function Home() {
  const [inCode, setInCode] = useState("input");
  const [outCode, setOutCode] = useState("output");
  const [langs, setLangs] = useState([]);
  const [langId, setLangId] = useState({ name: "Python", id: 71 });
  const [token, setToken] = useState("");

  const lang_url = "https://judge0-ce.p.rapidapi.com/languages";
  const create_sub_url =
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
  const get_sub_url = "https://judge0-ce.p.rapidapi.com/submissions/";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "d9f1492fe6msh472b72075455446p1c3f4djsnd161a26a5acb",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
  };

  let post_options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "d9f1492fe6msh472b72075455446p1c3f4djsnd161a26a5acb",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
  };

  useEffect(() => {
    getSubmission();
  }, [token]);

  useEffect(() => {
    getLang();
  }, []);

  function getLang() {
    fetch(lang_url, options)
      .then((res) => res.json())
      .then((json) => {
        setLangs(json);
        console.log(json);
      })
      .catch((err) => console.error("error:" + err));
  }

  async function createSubmission() {
    let body_param = `{"language_id":${langId.id}, "source_code":"${encode(
      inCode
    )}"}`;
    post_options.body = body_param;
    console.log(post_options);

    await fetch(create_sub_url, post_options)
      .then((res) => res.json())
      .then((json) => setToken(json.token))
      .catch((err) => console.error("error:" + err));
  }

  async function getSubmission() {
    let token_url = get_sub_url + token;
    let params = { base64_encoded: "true", fields: "*" };
    options.params = params;
    await fetch(token_url, options)
      .then((res) => res.json())
      .then((json) => setOutCode(json.stdout))
      .catch((err) => console.error("error:" + err));
  }

  const e_options = {
    fontSize: 20,
  };

  return (
    <div className="row">
      <div className="col-xl-6 col-md-6 col-sm-12 border vh-100 overflow-hidden">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div>
            <select
              className="form-select"
              onChange={(e) =>{
                console.log('e = ', e)
                setLangId({ name: e.target.value.innerText, id: e.target.value })
              }
              }
            >
              {langs.map((ele) => {
                return (
                  <option id={ele.name} value={ele.id} selected={ele.id == 71}>
                    {ele.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <button className="btn btn-primary" onClick={createSubmission}>
              Run Code
            </button>
          </div>
        </div>
        <div className="h-100">
          <Editor
            options={e_options}
            height="calc(100vh - 50px)"
            width="100%"
            language={langId.name}
            defaultLanguage="python"
            defaultValue="# Enter your code here"
            onChange={(value) => {
              setInCode(value);
            }}
          />
        </div>
      </div>

      <div className="col-xl-6 col-md-6 col-sm-12 overflow-hidden">
        <div className="h-100 p-3">
          <label class="form-label">Output</label>
          <textarea
            className="form-control h-100 w-100 output-text"
            value={outCode}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default Home;
