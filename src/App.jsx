import React, { useState, useEffect } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import Switch from "./components/Switch";
import CustomSelect from "./components/CustomSelect";
import Loader from "./components/Loader";
import SubmitButton from "./components/SubmitButton";
import ResetButton from "./components/ResetButton";
import "./App.css";
import CodeButton from "./components/CodeButton";
import Logo from "./blind.png"
import Footer from "./components/Footer";

const BlindCodingRound = () => {
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [language, setLanguage] = useState("C");
  const [submitted1, setSubmitted1] = useState(false);
  const [submitted2, setSubmitted2] = useState(false);
  const [output1, setOutput1] = useState("");
  const [output2, setOutput2] = useState("");
  const [inputs1, setInputs1] = useState("");
  const [inputs2, setInputs2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [blurred, setBlurred] = useState(true);
  const [darkTheme, setDarkTheme] = useState(true);
  const [showCode1, setShowCode1] = useState(false); // New state to manage code textarea visibility
  const [showCode2, setShowCode2] = useState(false); // New state to manage code textarea visibility
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (code1 || inputs1 || code2 || inputs2) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [code1, inputs1, code2, inputs2]);

  const handleChange1 = (value) => {
    setCode1(value);
  };
  const handleChange2 = (value) => {
    setCode2(value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleInputChange1 = (e) => {
    setInputs1(e.target.value);
  };
  const handleInputChange2 = (e) => {
    setInputs2(e.target.value);
  };

  const handleSubmit1 = async () => {
    setLoading1(true);
    setSubmitted1(true);
    const stdin = inputs1;

    try {
      const result = await compileCode(code1, language, stdin);
      setOutput1(result);
    } catch (error) {
      setOutput1(`Error: ${error.message}`);
    } finally {
      setLoading1(false);
    }
  };
  const handleSubmit2 = async () => {
    setLoading2(true);
    setSubmitted2(true);
    const stdin = inputs2;

    try {
      const result = await compileCode(code2, language, stdin);
      setOutput2(result);
    } catch (error) {
      setOutput2(`Error: ${error.message}`);
    } finally {
      setLoading2(false);
    }
  };

  const compileCode = async (code, language, stdin) => {
    try {
      const { language: mappedLanguage, version } = mapLanguage(language);
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: mappedLanguage,
          version: version,
          files: [{ name: `main.${getExtension(language)}`, content: code }],
          stdin: stdin,
        }
      );
      return response.data.run.output || "No output";
    } catch (error) {
      throw new Error(
        error.response ? error.response.data.message : "Compilation failed"
      );
    }
  };

  const mapLanguage = (language) => {
    switch (language) {
      case "C":
        return { language: "c", version: "10.2.0" };
      case "C++":
        return { language: "cpp", version: "10.2.0" };
      case "Java":
        return { language: "java", version: "15.0.2" };
      case "Python":
        return { language: "python", version: "3.10.0" };
      case "JavaScript":
        return { language: "javascript", version: "18.15.0" };
      default:
        return { language: "c", version: "10.2.0" };
    }
  };

  const getExtension = (language) => {
    switch (language) {
      case "C":
        return "c";
      case "C++":
        return "cpp";
      case "Java":
        return "java";
      case "Python":
        return "py";
      case "JavaScript":
        return "js";
      default:
        return "txt";
    }
  };

  const handleReset1 = () => {
    setCode1("");
    setLanguage("C");
    setInputs1("");
    setSubmitted1(false);
    setOutput1("");
    setBlurred(true);
    setShowCode1(false); // Reset the showCode state
  };
  const handleReset2 = () => {
    setCode2("");
    setLanguage("C");
    setInputs2("");
    setSubmitted2(false);
    setOutput2("");
    setBlurred(true);
    setShowCode2(false); // Reset the showCode state
  };

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  const handleToggleCode1 = () => {
    setShowCode1((prev) => !prev); // Toggle the showCode state
  };
  const handleToggleCode2 = () => {
    setShowCode2((prev) => !prev); // Toggle the showCode state
  };

  const options = [
    { value: "C", label: "C" },
    { value: "C++", label: "C++" },
    { value: "Java", label: "Java" },
    { value: "Python", label: "Python" },
    { value: "JavaScript", label: "JavaScript" },
  ];

  return (
    <>
    
    <div
      style={{
        padding: "20px",
        backgroundColor: darkTheme ? "#1e1e1e" : "#f5f5f5",
        color: darkTheme ? "#ffffff" : "#000000",
        minHeight: "100vh",
      }}
    >

      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <img src={Logo} alt="logo" />
      <h2
      style={{textAlign: 'center'}}
      ><span style={{color: "#ff9300"}}>Blind</span> Coding <span style={{color: "#59ff00"}}>Round</span></h2>
      </div>
      <div className="Navbar-next" style={{ display: "flex" }}>
        <div style={{ marginBottom: "19px" }}>
          <h4 style={{ marginBottom: "10px", marginTop: "19px", color: "blue" }}>
            Select language
          </h4>
          <CustomSelect
            options={options}
            selectedValue={language}
            onChange={setLanguage}
          />
        </div>
        <div className="switch-container">
          <Switch toggleTheme={toggleTheme} />
        </div>
      </div>

      {/* Question1 */}
      <div
        className="question"
        style={{
          margin: "20px 0",
          padding: "15px",
          border: "1px solid #bd00ff",
          borderRadius: "5px",
          backgroundColor: darkTheme ? "#2e2e2e" : "#ffffff",
          color: darkTheme ? "#52ff33" : "#000000",
        }}
      >
        <h4>
          <u>Q1)</u>&nbsp;&nbsp;Given a team with varying workload
          contributions, calculate the total workload each member would handle
          if one specific member were temporarily excluded. The goal is to
          understand the impact of each member's absence on the overall project
          workload without direct comparison.
          <br />
          <br />
          Example 1:
          <br />
          <code>
            Input: Team contributions: [5, 3, 2, 6]
            <br />
            Alice: 5 units, Bob: 3 units, Charlie: 2 units, David: 6 units
            <br />
            <br />
            Workloads if each member is excluded:
            <br />
            Output: <br />
            If Alice is excluded: 3 * 2 * 6 = 36
            <br />
            If Bob is excluded: 5 * 2 * 6 = 60
            <br />
            If Charlie is excluded: 5 * 3 * 6 = 90
            <br />
            If David is excluded: 5 * 3 * 2 = 30
            <br />
            Result: [36, 60, 90, 30]
          </code>
          <br/><br/>
          You must write an algorithm that runs in O(n) time and without using the division operation.
          <br />
          <br />
        </h4>
        <h4>Code Below...</h4>
      </div>

      <div className="editor-container">
        <div className={`monaco-editor-blur ${blurred ? "blurred" : ""}`}>
          <MonacoEditor
            height="250px"
            width="100%"
            language={getMonacoLanguage(language)}
            value={code1}
            onChange={handleChange1}
            theme="vs-dark"
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              readOnly: false,
              wordWrap: "on",
            }}
            aria-label="Code input area"
          />
        </div>
        <textarea
          rows="10"
          placeholder="Enter input data here..."
          value={inputs1}
          onChange={handleInputChange1}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: darkTheme ? "#2c2c2c" : "#ffffff",
            color: darkTheme ? "#ffffff" : "#000000",
            border: "1px solid #fffb00",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
          aria-label="Input data"
        />
      </div>

      <div className="ButtonContainer">
        <SubmitButton
          onClick={handleSubmit1}
          aria-label="Submit code"
          disabled={loading1}
        />
        <ResetButton onClick={handleReset1} aria-label="Reset" />
      </div>

      {submitted1 && (
        <div style={{ marginTop: "20px" }}>
          {loading1 ? (
            <Loader />
          ) : (
            <>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {!showCode1 ? (
                  <CodeButton onClick={handleToggleCode1} />
                ) : (
                  <button className="close-button" onClick={handleToggleCode1}>
                    Close
                  </button>
                )}
                {showCode1 && (
                  <div>
                    <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                      Code:
                    </h3>
                    <pre
                      style={{
                        backgroundColor: darkTheme ? "#1e1e1e" : "#ffffff",
                        color: darkTheme ? "#52ff33" : "#000000",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      {code1}
                    </pre>
                  </div>
                )}
              </div>
              <p
                style={{
                  marginTop: "15px",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  color: darkTheme ? "blue" : "#000000",
                }}
              >
                Language: {language}
              </p>
              <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Output:
              </h3>
              <pre
                style={{
                  backgroundColor: darkTheme ? "#1e1e1e" : "#ffffff",
                  color: darkTheme ? "#33e3ff" : "#000000",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {output1}
              </pre>
            </>
          )}
        </div>
      )}

      {/* Question 2 */}
      <div
        className="question"
        style={{
          margin: "20px 0",
          padding: "15px",
          border: "1px solid #bd00ff",
          borderRadius: "5px",
          backgroundColor: darkTheme ? "#2e2e2e" : "#ffffff",
          color: darkTheme ? "#52ff33" : "#000000",
        }}
      >
        <h4>
          <u>Q2)</u>&nbsp;&nbsp;Imagine you’re designing software for an ATM
          that reads user input to determine the amount of money to withdraw.
          The user might accidentally input spaces, include extra characters, or
          type an incorrect format. The software needs to convert the input
          accurately into a valid amount: Ignoring Unnecessary Characters: The
          ATM must ignore leading spaces and irrelevant symbols, such as
          non-numeric characters, to focus on the valid amount. Handling Signs:
          It should recognize whether the input amount is meant to be positive
          (default) or mistakenly negative, correcting it to a valid state.
          Reading Amounts: The ATM reads digits until a non-digit character or
          the end of the input is reached, ensuring that only valid numbers are
          considered.
          <br />
          <br />
          Example 1:
          <br />
          <code>
            Input: " 00700"
            <br/>
            Explanation: <br/>The input has leading spaces and zeros, mimicking a user typing carefully but redundantly.
            <br/>Output: 700
            <br/>Reasoning: The ATM ignores spaces and leading zeros, converting the input to 700
            <br />
          </code>
          <br />
        </h4>
        <h4>
        Example 2:
            <br />
            <code>
              Input:  "-42 78"
              <br/>
              Output: -42
            <br />
            </code>
        </h4>
        <br/>
        <h4>
        Example 3:
            <br />
            <code>
              Input: "words and 987"
              <br/>
              Output: 0
            <br />
            </code>
        </h4>
        <br/>
        <h4>
        Example 4:
            <br />
            <code>
              Input: "+123xyz456"
              <br/>
              Output: 123
            <br />
            </code>
        </h4>
        <br/>
        <h4>
        Example 5:
            <br />
            <code>
              Input: " -042"
              <br/>
              Output: -42
            <br />
            </code>
        </h4>
        <br/>
        <h4>Code Below...</h4>
      </div>

      <div className="editor-container">
        <div className={`monaco-editor-blur ${blurred ? "blurred" : ""}`}>
          <MonacoEditor
            height="250px"
            width="100%"
            language={getMonacoLanguage(language)}
            value={code2}
            onChange={handleChange2}
            theme="vs-dark"
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              readOnly: false,
              wordWrap: "on",
            }}
            aria-label="Code input area"
          />
        </div>
        <textarea
          rows="10"
          placeholder="Enter input data here..."
          value={inputs2}
          onChange={handleInputChange2}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: darkTheme ? "#2c2c2c" : "#ffffff",
            color: darkTheme ? "#ffffff" : "#000000",
            border: "1px solid #fffb00",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
          aria-label="Input data"
        />
      </div>

      <div className="ButtonContainer">
        <SubmitButton
          onClick={handleSubmit2}
          aria-label="Submit code"
          disabled={loading2}
        />
        <ResetButton onClick={handleReset2} aria-label="Reset" />
      </div>

      {submitted2 && (
        <div style={{ marginTop: "20px" }}>
          {loading2 ? (
            <Loader />
          ) : (
            <>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {!showCode2 ? (
                  <CodeButton onClick={handleToggleCode2} />
                ) : (
                  <button className="close-button" onClick={handleToggleCode2}>
                    Close
                  </button>
                )}
                {showCode2 && (
                  <div>
                    <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                      Code:
                    </h3>
                    <pre
                      style={{
                        backgroundColor: darkTheme ? "#1e1e1e" : "#ffffff",
                        color: darkTheme ? "#52ff33" : "#000000",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      {code2}
                    </pre>
                  </div>
                )}
              </div>
              <p
                style={{
                  marginTop: "15px",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  color: darkTheme ? "blue" : "#000000",
                }}
              >
                Language: {language}
              </p>
              <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Output:
              </h3>
              <pre
                style={{
                  backgroundColor: darkTheme ? "#1e1e1e" : "#ffffff",
                  color: darkTheme ? "#33e3ff" : "#000000",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {output2}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
    <Footer></Footer>
    </>
  );
};

const getMonacoLanguage = (language) => {
  switch (language) {
    case "C":
      return "c";
    case "C++":
      return "cpp";
    case "Java":
      return "java";
    case "Python":
      return "python";
    case "JavaScript":
      return "javascript";
    default:
      return "plaintext";
  }
};

export default BlindCodingRound;
