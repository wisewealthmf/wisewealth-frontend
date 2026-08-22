import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  FaHome,
  FaCar,
  FaHeart,
  FaPlane,
  FaGraduationCap,
  FaSyncAlt,
} from "react-icons/fa";
import { createConsultation } from "../api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import "./ToolsPage.css";
import PlanTomorrowModal from "../components/PlanTomorrowModal";


const ToolsPage = () => {
  const [toast, setToast] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(15);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipResult, setSipResult] = useState(null);

  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [lumpsumYears, setLumpsumYears] = useState(10);
  const [lumpsumReturn, setLumpsumReturn] = useState(12);
  const [lumpsumResult, setLumpsumResult] = useState(null);

  const [swpCorpus, setSwpCorpus] = useState(5000000);
  const [swpReturn, setSwpReturn] = useState(8);
  const [swpIncome, setSwpIncome] = useState("");
  const [swpResult, setSwpResult] = useState(null);
  const [swpYears, setSwpYears] = useState(10);

  const [stepSip, setStepSip] = useState(5000);
  const [stepYears, setStepYears] = useState(15);
  const [stepReturn, setStepReturn] = useState(12);
  const [stepIncrease, setStepIncrease] = useState(10);
  const [stepResult, setStepResult] = useState(null);

  const [comboLumpsum, setComboLumpsum] = useState(100000);
  const [comboSip, setComboSip] = useState(5000);
  const [comboYears, setComboYears] = useState(10);
  const [comboReturn, setComboReturn] = useState(12);
  const [comboResult, setComboResult] = useState(null);

  const [goalName, setGoalName] = useState("Dream Wedding");
  const [goalCost, setGoalCost] = useState("1000000");
  const [inflation, setInflation] = useState("7");
  const [years, setYears] = useState("10");
  const [returns, setReturns] = useState("12");

  const [result, setResult] = useState(null);

  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const scrollToCTA = () => {
    const element = document.getElementById("contact-cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToResult = () => {
    setTimeout(() => {
      document.getElementById("calc-result")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
  };

  const calculateCombo = () => {
    const r = comboReturn / 100 / 12;
    const n = comboYears * 12;

    const sipFuture = comboSip * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    const lumpFuture =
      comboLumpsum * Math.pow(1 + comboReturn / 100, comboYears);

    const futureValue = sipFuture + lumpFuture;

    const investedAmount = comboLumpsum + comboSip * n;

    const wealthGained = futureValue - investedAmount;

    setComboResult({
      futureValue,
      investedAmount,
      wealthGained,
    });
    scrollToResult();
  };

  const calculateStepUp = () => {
    let corpus = 0;
    let monthlySip = stepSip;

    const r = stepReturn / 100 / 12;

    let investedAmount = 0;

    for (let year = 1; year <= stepYears; year++) {
      for (let month = 1; month <= 12; month++) {
        investedAmount += monthlySip;

        corpus = (corpus + monthlySip) * (1 + r);
      }

      monthlySip = monthlySip * (1 + stepIncrease / 100);
    }

    setStepResult({
      futureValue: corpus,
      investedAmount,
      wealthGained: corpus - investedAmount,
    });
    scrollToResult();
  };

  const calculateSWP = () => {
    const suggestedIncome = (swpCorpus * swpReturn) / 100 / 12;

    const monthlyIncome =
      swpIncome === "" ? suggestedIncome : Number(swpIncome);

    const withdrawalRate = (monthlyIncome * 12 * 100) / swpCorpus;

    const futureValue = swpCorpus * Math.pow(1 + swpReturn / 100, swpYears);

    const growthAmount = futureValue - swpCorpus;

    setSwpResult({
      monthlyIncome,
      withdrawalRate,
      suggestedIncome,
      futureValue,
      growthAmount,
    });
    scrollToResult();
  };

  const calculateLumpsum = () => {
    const futureValue =
      lumpsumAmount * Math.pow(1 + lumpsumReturn / 100, lumpsumYears);

    setLumpsumResult(futureValue);
    scrollToResult();
  };

  const calculateSIP = () => {
    const r = sipReturn / 100 / 12;
    const n = sipYears * 12;

    const futureValue = sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    const investedAmount = sipAmount * sipYears * 12;

    setSipResult({
      futureValue,
      investedAmount,
      wealthGained: futureValue - investedAmount,
    });
    scrollToResult();
  };

  const formatINR = (val) => {
    if (val >= 10000000) return "₹" + (val / 10000000).toFixed(2) + " Cr";
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  const futureCost = (presentValue, inflationRate, years) => {
    return presentValue * Math.pow(1 + inflationRate / 100, years);
  };

  const monthlySIP = (targetCorpus, annualReturn, years) => {
    const r = annualReturn / 100 / 12;
    const n = years * 12;

    if (r === 0) return targetCorpus / n;

    return (targetCorpus * r) / (Math.pow(1 + r, n) - 1);
  };

  const lumpsumToday = (targetCorpus, annualReturn, years) => {
    return targetCorpus / Math.pow(1 + annualReturn / 100, years);
  };

  const topupSIPStart = (
    targetCorpus,
    annualReturn,
    years,
    stepupRate = 10,
  ) => {
    const r = annualReturn / 100 / 12;
    const n = years * 12;
    const g = stepupRate / 100;

    let unitAccumulated = 0;

    for (let m = 0; m < n; m++) {
      const year = Math.floor(m / 12);
      const unitSIP = Math.pow(1 + g, year);

      unitAccumulated += unitSIP * Math.pow(1 + r, n - m);
    }

    return targetCorpus / unitAccumulated;
  };

  const comboSIPAndLumpsum = (targetCorpus, annualReturn, years) => {
    const ls = lumpsumToday(targetCorpus, annualReturn, years) * 0.5;

    const lsGrown = ls * Math.pow(1 + annualReturn / 100, years);

    const remaining = targetCorpus - lsGrown;

    const sip = remaining > 0 ? monthlySIP(remaining, annualReturn, years) : 0;

    return {
      sip,
      lumpsum: ls,
    };
  };

  const calculateGoal = () => {
    const fv = futureCost(Number(goalCost), Number(inflation), Number(years));

    const sip = monthlySIP(fv, Number(returns), Number(years));

    const lumpsum = lumpsumToday(fv, Number(returns), Number(years));

    const combo = comboSIPAndLumpsum(fv, Number(returns), Number(years));

    const topup = topupSIPStart(fv, Number(returns), Number(years), 10);

    setResult({
      futureCost: fv,
      sip,
      lumpsum,
      comboSip: combo.sip,
      comboLumpsum: combo.lumpsum,
      topupSip: topup,
    });
    scrollToResult();
  };

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    goal: "",
    captcha: "",
  });
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    refreshCaptcha();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [showPlanModal, setShowPlanModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaAnswer !== captchaTarget) {
      setToast({
        message: "Please complete captcha correctly.",
        type: "error",
      });
      return false;
    }

    try {
      await createConsultation({
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        financialGoal: formData.goal,
        notes: "",
      });
      setToast({
        message: "Thank you! We will contact you soon.",
        type: "success",
      });
      setFormData({ name: "", mobile: "", email: "", goal: "", captcha: "" });
      refreshCaptcha();
      return true;
    } catch (error) {
      console.error(error);
      setToast({
        message: "Unable to submit your request. Please try again later.",
        type: "error",
      });
      return false;
    }
  };

  const captchaIcons = [
    { id: "home", icon: <FaHome /> },
    { id: "car", icon: <FaCar /> },
    { id: "health", icon: <FaHeart /> },
    { id: "travel", icon: <FaPlane /> },
    { id: "education", icon: <FaGraduationCap /> },
  ];

  const [captchaTarget, setCaptchaTarget] = useState("home");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const random =
      captchaIcons[Math.floor(Math.random() * captchaIcons.length)];

    setCaptchaTarget(random.id);
    setCaptchaAnswer("");
  };

  const renderContent = () => {
    // Calculator tools screen

    if (selectedCalculator === "combo") {
      return (
        <section className="calculator-section">
          <div className="container">
            <button
              className="back-btn"
              onClick={() => setSelectedCalculator(null)}
            >
              Back
            </button>

            <div className="calculator-card">
              <h2>Lumpsum + SIP Calculator</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Lumpsum Investment</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={comboLumpsum}
                    onChange={(e) => setComboLumpsum(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Monthly SIP</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={comboSip}
                    onChange={(e) => setComboSip(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Investment Years</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={comboYears}
                    onChange={(e) => setComboYears(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Expected Return %</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={comboReturn}
                    onChange={(e) => setComboReturn(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="btn-wrapper">
                <button className="calculate-btn" onClick={calculateCombo}>
                  Calculate
                </button>
              </div>

              {comboResult && (
                <div id="calc-result" className="sip-result-wrapper">
                  <div className="sip-result-left">
                    <div className="result-item">
                      <span>Total Invested</span>

                      <h3>{formatINR(comboResult.investedAmount)}</h3>
                    </div>

                    <div className="result-item">
                      <span>Wealth Gained</span>

                      <h3>{formatINR(comboResult.wealthGained)}</h3>
                    </div>

                    <div className="result-item">
                      <span>Expected Return</span>

                      <h3>{comboReturn}%</h3>
                    </div>

                    <div className="result-item">
                      <span>Investment Period</span>

                      <h3>{comboYears} Years</h3>
                    </div>

                    <div className="result-item total">
                      <span>Future Value</span>

                      <h2>{formatINR(comboResult.futureValue)}</h2>
                    </div>
                  </div>

                  <div className="sip-result-right">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Invested",
                              value: comboResult.investedAmount,
                            },
                            {
                              name: "Returns",
                              value: comboResult.wealthGained,
                            },
                          ]}
                          dataKey="value"
                          innerRadius={75}
                          outerRadius={115}
                        >
                          <Cell fill="#2266a0" />

                          <Cell fill="#9ec3e5" />
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (selectedCalculator === "stepup") {
      return (
        <section className="calculator-section">
          <div className="container">
            <button
              className="back-btn"
              onClick={() => setSelectedCalculator(null)}
            >
              Back
            </button>

            <div className="calculator-card">
              <h2>Step-Up SIP Calculator</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Starting Monthly SIP</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={stepSip}
                    onChange={(e) => setStepSip(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Investment Years</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={stepYears}
                    onChange={(e) => setStepYears(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Expected Return %</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={stepReturn}
                    onChange={(e) => setStepReturn(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Annual SIP Increase %</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={stepIncrease}
                    onChange={(e) => setStepIncrease(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="btn-wrapper">
                <button className="calculate-btn" onClick={calculateStepUp}>
                  Calculate
                </button>
              </div>

              {stepResult && (
                <div id="calc-result" className="sip-result-wrapper">
                  <div className="sip-result-left">
                    <div className="result-item">
                      <span>Starting SIP</span>

                      <h3>{formatINR(stepSip)}</h3>
                    </div>

                    <div className="result-item">
                      <span>Total Invested</span>

                      <h3>{formatINR(stepResult.investedAmount)}</h3>
                    </div>

                    <div className="result-item">
                      <span>Wealth Gained</span>

                      <h3>{formatINR(stepResult.wealthGained)}</h3>
                    </div>

                    <div className="result-item">
                      <span>Annual Step-Up</span>

                      <h3>{stepIncrease}%</h3>
                    </div>

                    <div className="result-item total">
                      <span>Future Value</span>

                      <h2>{formatINR(stepResult.futureValue)}</h2>
                    </div>
                  </div>

                  <div className="sip-result-right">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Invested",
                              value: stepResult.investedAmount,
                            },
                            {
                              name: "Returns",
                              value: stepResult.wealthGained,
                            },
                          ]}
                          dataKey="value"
                          innerRadius={75}
                          outerRadius={115}
                        >
                          <Cell fill="#2266a0" />

                          <Cell fill="#9ec3e5" />
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (selectedCalculator === "swp") {
      return (
        <section className="calculator-section">
          <div className="container">
            <button
              className="back-btn"
              onClick={() => setSelectedCalculator(null)}
            >
              Back
            </button>

            <div className="calculator-card">
              <h2>SWP Calculator</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Investment Corpus</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={swpCorpus}
                    onChange={(e) => setSwpCorpus(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Expected Return %</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={swpReturn}
                    onChange={(e) => setSwpReturn(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Investment Period (Years)</label>

                  <input
                    type="number"
                    className="calc-input"
                    value={swpYears}
                    onChange={(e) => setSwpYears(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Desired Monthly Income (Optional)</label>

                  <input
                    type="number"
                    className="calc-input"
                    placeholder="Auto-calculate if left blank"
                    value={swpIncome}
                    onChange={(e) => setSwpIncome(e.target.value)}
                  />
                </div>
              </div>

              <div className="btn-wrapper">
                <button className="calculate-btn" onClick={calculateSWP}>
                  Calculate
                </button>
              </div>

              {swpResult && (
                <div id="calc-result" className="sip-result-wrapper">
                  <div className="result-item">
                    <span>Investment Corpus</span>
                    <h3>{formatINR(swpCorpus)}</h3>
                  </div>

                  {swpIncome === "" ? (
                    <div className="result-item">
                      <span>Suggested Monthly SWP</span>

                      <h3>{formatINR(swpResult.suggestedIncome)}</h3>
                    </div>
                  ) : (
                    <div className="result-item">
                      <span>Your Monthly Income</span>

                      <h3>{formatINR(swpResult.monthlyIncome)}</h3>
                    </div>
                  )}

                  <div className="result-item">
                    <span>Expected CAGR</span>
                    <h3>{swpReturn}%</h3>
                  </div>

                  <div className="result-item">
                    <span>Growth Generated</span>
                    <h3>{formatINR(swpResult.growthAmount)}</h3>
                  </div>

                  <div className="result-item total">
                    <span>Corpus Value After {swpYears} Years</span>

                    <h2>{formatINR(swpResult.futureValue)}</h2>
                  </div>

                  <p className="swp-note">
                    Assuming a CAGR of
                    <strong> {swpReturn}%</strong>, your corpus of
                    <strong> {formatINR(swpCorpus)}</strong>
                    can potentially grow to
                    <strong> {formatINR(swpResult.futureValue)}</strong>
                    over {swpYears} years.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (selectedCalculator === "lumpsum") {
      return (
        <section className="calculator-section">
          <div className="container">
            <button
              className="back-btn"
              onClick={() => setSelectedCalculator(null)}
            >
              Back
            </button>

            <div className="calculator-card">
              <h2>One Time Investment Calculator</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Investment Amount</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Years</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={lumpsumYears}
                    onChange={(e) => setLumpsumYears(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Return %</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={lumpsumReturn}
                    onChange={(e) => setLumpsumReturn(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="btn-wrapper">
                <button className="calculate-btn" onClick={calculateLumpsum}>
                  Calculate
                </button>
              </div>

              {lumpsumResult && (
                <div id="calc-result" className="sip-result-wrapper">
                  <div className="sip-result-left">
                    <div className="result-item">
                      <span>Invested Amount</span>

                      <h3>{formatINR(lumpsumAmount)}</h3>
                    </div>

                    <div className="result-item">
                      <span>Wealth Gained</span>

                      <h3>{formatINR(lumpsumResult - lumpsumAmount)}</h3>
                    </div>

                    <div className="result-item total">
                      <span>Future Value</span>

                      <h2>{formatINR(lumpsumResult)}</h2>
                    </div>
                  </div>

                  <div className="sip-result-right">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Invested",
                              value: lumpsumAmount,
                            },
                            {
                              name: "Returns",
                              value: lumpsumResult - lumpsumAmount,
                            },
                          ]}
                          dataKey="value"
                          innerRadius={75}
                          outerRadius={115}
                        >
                          <Cell fill="#2266a0" />

                          <Cell fill="#9ec3e5" />
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (selectedCalculator === "sip") {
      return (
        <section className="calculator-section">
          <div className="container">
            <button
              className="back-btn"
              onClick={() => setSelectedCalculator(null)}
            >
              Back
            </button>

            <div className="calculator-card">
              <h2>SIP Calculator</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Monthly SIP</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Years</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={sipYears}
                    onChange={(e) => setSipYears(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Return %</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={sipReturn}
                    onChange={(e) => setSipReturn(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="btn-wrapper">
                <button className="calculate-btn" onClick={calculateSIP}>
                  Calculate
                </button>
              </div>

              {sipResult && (
                <div id="calc-result" className="sip-result-wrapper">
                  <div className="sip-result-left">
                    <div className="result-item">
                      <span>Invested Amount</span>

                      <h3>{formatINR(sipResult.investedAmount)}</h3>
                    </div>

                    <div className="result-item">
                      <span>Wealth Gained</span>

                      <h3>{formatINR(sipResult.wealthGained)}</h3>
                    </div>

                    <div className="result-item total">
                      <span>Future Value</span>

                      <h2>{formatINR(sipResult.futureValue)}</h2>
                    </div>
                  </div>

                  <div className="sip-result-right">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Invested",
                              value: sipResult.investedAmount,
                            },
                            {
                              name: "Returns",
                              value: sipResult.wealthGained,
                            },
                          ]}
                          dataKey="value"
                          innerRadius={75}
                          outerRadius={115}
                        >
                          <Cell fill="#2266a0" />

                          <Cell fill="#9ec3e5" />
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (selectedGoal === "financial-health") {
      return (
        <section className="calculator-section">
          <div className="container">
            <button className="back-btn" onClick={() => setSelectedGoal(null)}>
              Back to Calculator
            </button>

            <div className="financial-health-wrapper">
              <h2 className="goal-based-h2">Financial Health Check Tool</h2>

              <p className="financial-health-subtitle">
                Analyze your complete financial situation, identify gaps and
                understand how close you are to your long-term goals.
              </p>

              <iframe
                src="/financial-health-check/index.html"
                title="Financial Health Check"
                className="financial-health-frame"
              />
            </div>
          </div>
        </section>
      );
    }

    if (selectedGoal === "goal-based") {
      return (
        <section className="calculator-section">
          <div className="container">
            <button className="back-btn" onClick={() => setSelectedGoal(null)}>
              Back to Calculators
            </button>

            <div className="calculator-cardd">
              <h2 className="goal-based-h2">Goal Based Planning Calculator</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Goal Name</label>
                  <select
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="calc-input"
                  >
                    <option>Dream Wedding</option>
                    <option>Dream Trip</option>
                    <option>Dream Car</option>
                    <option>Dream House</option>
                    <option>Child's Education</option>
                    <option>Child's Marriage</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Current Cost (₹)</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={goalCost}
                    onChange={(e) => setGoalCost(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Inflation %</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={inflation}
                    onChange={(e) => setInflation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Years Away</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Expected Return %</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={returns}
                    onChange={(e) => setReturns(e.target.value)}
                  />
                </div>
              </div>

              <div className="btn-wrapper">
                <button className="calculate-btn" onClick={calculateGoal}>
                  Calculate Goal Plan
                </button>
              </div>

              {result && (
                <div id="calc-result" className="goal-results">
                  <div className="future-cost-card">
                    <p className="future-label">
                      After {years} years, your {goalName} will cost
                    </p>

                    <h2 className="future-amount">
                      {formatINR(result.futureCost)}
                    </h2>

                    <p className="future-note">
                      Due to inflation of {inflation}% per year
                    </p>
                  </div>

                  <h3 className="options-title">
                    To achieve this goal, here's what you can do:
                  </h3>

                  <div className="options-grid">
                    <div className="option-card">
                      <h4>Monthly SIP</h4>

                      <div className="option-amount">
                        {formatINR(result.sip)}
                      </div>

                      <p>per month for {years} years</p>

                      <small>Invest a fixed amount every month.</small>
                    </div>

                    <div className="option-card recommended">
                      <span className="recommended-badge">Recommended</span>

                      <h4>SIP + Lumpsum</h4>

                      <div className="option-amount">
                        {formatINR(result.comboSip)}/mo
                      </div>

                      <p>+ {formatINR(result.comboLumpsum)}</p>

                      <small>Best of both worlds.</small>
                    </div>

                    <div className="option-card">
                      <h4>Lumpsum</h4>

                      <div className="option-amount">
                        {formatINR(result.lumpsum)}
                      </div>

                      <p>Invest once today</p>

                      <small>Let compounding work.</small>
                    </div>

                    <div className="option-card">
                      <h4>Top-up SIP</h4>

                      <div className="option-amount">
                        {formatINR(result.topupSip)}
                      </div>

                      <p>+10% every year</p>

                      <small>Increase SIP as income grows.</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (selectedCategory === "calculators") {
      return (
        <section className="tool-categories">
          <div className="back-wrapper">
            <button
              className="back-btn"
              onClick={() => setSelectedCategory(null)}
            >
              Back to Tools
            </button>
          </div>

          <div className="planner-cards">
            <div
              className="planner-card-v2"
              onClick={() => setSelectedGoal("goal-based")}
            >
              <div className="planner-top-line"></div>

              <h3>Goal Based Planning Calculators</h3>

              <p>
                Education, Marriage, Retirement, Home Purchase, Vacation and
                more.
              </p>

              <div className="planner-link">Explore Tool →</div>
            </div>

            <div
              className="planner-card-v2"
              onClick={() => setSelectedCalculator("sip")}
            >
              <div className="planner-top-line"></div>

              <h3>SIP Calculator</h3>

              <p>
                See how small monthly investments can grow into long-term
                wealth.
              </p>

              <div className="planner-link">Explore Tool →</div>
            </div>

            <div
              className="planner-card-v2"
              onClick={() => setSelectedCalculator("swp")}
            >
              <div className="planner-top-line"></div>

              <h3>SWP Calculator</h3>

              <p>
                Estimate a steady income stream from your accumulated
                investments.
              </p>

              <div className="planner-link">Explore Tool →</div>
            </div>

            <div
              className="planner-card-v2"
              onClick={() => setSelectedCalculator("stepup")}
            >
              <div className="planner-top-line"></div>

              <h3>Step-up SIP Calculator</h3>

              <p>
                See how increasing your SIP each year can accelerate wealth
                creation.
              </p>

              <div className="planner-link">Explore Tool →</div>
            </div>

            <div
              className="planner-card-v2"
              onClick={() => setSelectedCalculator("lumpsum")}
            >
              <div className="planner-top-line"></div>

              <h3>One Time Investment Calculator</h3>

              <p>Discover the future value of a one-time investment.</p>

              <div className="planner-link">Explore Tool →</div>
            </div>

            <div
              className="planner-card-v2"
              onClick={() => setSelectedCalculator("combo")}
            >
              <div className="planner-top-line"></div>

              <h3>Lumpsum + SIP Calculator</h3>

              <p>
                Calculate the combined power of a one-time investment and
                monthly SIPs.
              </p>

              <div className="planner-link">Explore Tool →</div>
            </div>

            <div
              className="planner-card-v2"
              onClick={() => setSelectedGoal("financial-health")}
            >
              <div className="planner-top-line"></div>

              <h3>Financial Health Check Tool</h3>

              <p>
                Analyze your financial health, understand your strengths and
                identify areas for improvement.
              </p>

              <div className="planner-link">Explore Tool →</div>
            </div>
          </div>
        </section>
      );
    }

    // Main categories screen
    return (
      <section className="tool-categories">
        <div className="container">
          <div
            className="tool-row"
            onClick={() => setSelectedCategory("calculators")}
          >
            <div className="tool-left">
              <h3>Calculators</h3>
              <p>Financial planning and goal based calculators</p>
            </div>

            <span className="tool-count">7 Tools</span>
          </div>

          <div className="tool-row" onClick={() => setShowComingSoon(true)}>
            <div className="tool-left">
              <h3>Research Tools - Simple</h3>
              <p>Basic mutual fund research and analysis</p>
            </div>

            <span className="tool-count">Tools</span>
          </div>

          <div className="tool-row" onClick={() => setShowComingSoon(true)}>
            <div className="tool-left">
              <h3>Research Tools - Advanced</h3>
              <p>Professional investment research tools</p>
            </div>

            <span className="tool-count">Tools</span>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="tools-page page-enter">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero reveal">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-hero-title">WiseWealth</h1>
            <p className="about-hero-tagline">Build Your Tomorrow</p>

            <button
              className="about-cta-button"
              onClick={() => setShowPlanModal(true)}
            >
              Plan My Tomorrow
            </button>
            <a href="https://topmate.io/wisewealth">
              <button className="about-cta-button">
              Book Free 1:1 Session
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <div className="tools-intro">
        <span className="section-title">Investment Research Suite</span>

        <h2 className="section-heading">Choose a Financial Tool</h2>

        <p className="section-subheading">
          Analyze mutual funds, compare schemes, track portfolios and plan your
          financial goals with powerful research tools.
        </p>
      </div>

      {renderContent()}

      {showComingSoon && (
  <div
    className="coming-overlay"
    onClick={() => setShowComingSoon(false)}
  >
    <div
      className="coming-card"
      onClick={(e) => e.stopPropagation()}
    >
      <h2>🚀 Coming Soon</h2>

      <p>
        We're building powerful research tools to help you
        analyze mutual funds like a professional.
      </p>

      <button
        onClick={() => setShowComingSoon(false)}
      >
        Got it
      </button>
    </div>
  </div>
)}

      <Footer />

      <PlanTomorrowModal
        show={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        captchaIcons={captchaIcons}
        captchaTarget={captchaTarget}
        captchaAnswer={captchaAnswer}
        setCaptchaAnswer={setCaptchaAnswer}
        refreshCaptcha={refreshCaptcha}
      />
    </div>
  );
};

export default ToolsPage;
