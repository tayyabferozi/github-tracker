import { useState } from "react";
import axios from "axios";

import "./styles.scss";
import Loader from "./components/Loader";

function App() {
  const [searchState, setSearchState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reposState, setReposState] = useState([]);
  const [errorState, setErrorState] = useState("");

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorState("");
    setReposState([]);
    axios
      .get(`https://api.github.com/users/${searchState}/repos`)
      .then((res) => {
        setReposState(res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setErrorState("Username  not found");
        } else {
          setErrorState("Oops! Something went wrong.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="main">
      <h1 className="mt-4 my-5">Github Tracker</h1>

      <form onSubmit={formSubmitHandler} action="">
        <input
          type="search"
          placeholder="Type a username..."
          value={searchState}
          onChange={(e) => setSearchState(e.target.value)}
        />

        <button className="btn">Search</button>

        {errorState && <div className="helper red">{errorState}</div>}
      </form>

      {isLoading ? (
        <div className="text-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="container-fluid px-0 mt-5">
            <div className="row gy-4">
              {reposState.map((el) => {
                const {
                  name,
                  clone_url,
                  updated_at,
                  stargazers_count,
                  forks_count,
                  open_issues_count,
                } = el;

                return (
                  <div className="col-xl-3 col-lg-4 col-sm-6" key={el.id}>
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={clone_url}
                      className="repo-item"
                    >
                      <div className="title mb-3 text-center">{name}</div>
                      <div className="sm date">
                        {" "}
                        <strong>Updated At:</strong>{" "}
                        {new Date(updated_at).toLocaleDateString()}{" "}
                        {new Date(updated_at).toLocaleTimeString()}
                      </div>
                      <div className="sm">
                        <strong>Stagers:</strong> {stargazers_count}
                      </div>
                      <div className="sm">
                        <strong>Forks:</strong> {forks_count}
                      </div>
                      <div className="sm">
                        <strong>Open issues:</strong> {open_issues_count}
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
