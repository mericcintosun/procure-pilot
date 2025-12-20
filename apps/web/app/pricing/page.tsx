"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiZap,
  FiCode,
  FiShield,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";
import Button from "../../components/ui/Button";
import Logo from "../../components/ui/Logo";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small teams getting started",
      icon: FiZap,
      color: "var(--primary)",
      features: [
        "50 analyses per month",
        "Basic PDF extraction",
        "Feasibility scoring",
        "Evidence references",
        "Email support",
        "Standard audit trail",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "For growing teams with API needs",
      icon: FiCode,
      color: "#04d6ff",
      features: [
        "200 analyses per month",
        "Advanced AI extraction",
        "Custom feasibility weights",
        "API access & SDK",
        "Priority support",
        "Enhanced audit trail",
        "Integration assistance",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For organizations with scale needs",
      icon: FiShield,
      color: "var(--success)",
      features: [
        "Unlimited analyses",
        "Dedicated infrastructure",
        "Custom integrations",
        "SLA guarantee",
        "Dedicated support",
        "White-label options",
        "On-premise deployment",
        "Custom features",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const usageBased = {
    title: "Pay-as-you-go",
    description: "Perfect for occasional use",
    price: "$2-5",
    unit: "per analysis",
    features: [
      "No monthly commitment",
      "Pay only for what you use",
      "Same features as Professional",
      "Perfect for testing",
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{
        paddingTop: "calc(var(--navbar-height) + var(--spacing-xl))",
        paddingBottom: "var(--spacing-3xl)",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: "var(--spacing-3xl)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--spacing-md)",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          <Logo showText={false} style={{ height: "100px", width: "auto" }} />
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "white",
            marginBottom: "var(--spacing-md)",
            background:
              "linear-gradient(135deg, var(--primary-light), var(--primary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Simple, Transparent Pricing
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-tertiary)",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Choose the plan that fits your team. All plans include evidence-first
          analysis and blockchain audit trails.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--spacing-xl)",
          marginBottom: "var(--spacing-3xl)",
        }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            style={{
              padding: "var(--spacing-2xl)",
              background: plan.popular
                ? "linear-gradient(135deg, rgba(4, 214, 255, 0.1), rgba(6, 182, 212, 0.05))"
                : "rgba(30, 41, 59, 0.6)",
              borderRadius: "var(--radius-xl)",
              border: plan.popular
                ? "2px solid #04d6ff"
                : "1px solid var(--border-primary)",
              position: "relative",
              overflow: "hidden",
              boxShadow: plan.popular ? "0 8px 32px rgba(4, 214, 255, 0.2)" : "var(--shadow-sm)",
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: "absolute",
                  top: "var(--spacing-md)",
                  right: "var(--spacing-md)",
                  padding: "0.25rem 0.75rem",
                  background: "#04d6ff",
                  color: "white",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Most Popular
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-md)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <div
                style={{
                  padding: "var(--spacing-md)",
                  background: `${plan.color}20`,
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <plan.icon
                  style={{
                    fontSize: "1.5rem",
                    color: plan.color,
                  }}
                />
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {plan.name}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {plan.description}
                </p>
              </div>
            </div>

            <div
              style={{
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.25rem",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {plan.period}
                  </span>
                )}
              </div>
            </div>

            <Button
              href="/rfq"
              variant={plan.popular ? "primary" : "outline"}
              size="lg"
              style={{
                width: "100%",
                marginBottom: "var(--spacing-xl)",
              }}
            >
              {plan.cta}
            </Button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
                marginTop: "var(--spacing-md)",
              }}
            >
              {plan.features.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--spacing-sm)",
                    color: "var(--text-secondary)",
                    fontSize: "0.9375rem",
                  }}
                >
                  <FiCheck
                    style={{
                      fontSize: "1rem",
                      color: plan.color,
                      marginTop: "0.125rem",
                      flexShrink: 0,
                    }}
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Usage-Based Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          padding: "var(--spacing-2xl)",
          background: "rgba(30, 41, 59, 0.6)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-primary)",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <FiTrendingUp
          style={{
            fontSize: "2rem",
            color: "var(--primary-light)",
            marginBottom: "var(--spacing-md)",
          }}
        />
        <h3
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "white",
            marginBottom: "var(--spacing-sm)",
          }}
        >
          {usageBased.title}
        </h3>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-tertiary)",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          {usageBased.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "0.25rem",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          <span
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "white",
            }}
          >
            {usageBased.price}
          </span>
          <span
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
            }}
          >
            {usageBased.unit}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-xs)",
            marginBottom: "var(--spacing-lg)",
            textAlign: "left",
          }}
        >
          {usageBased.features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.9375rem",
              }}
            >
              <FiCheck
                style={{
                  fontSize: "1rem",
                  color: "var(--primary-light)",
                  marginTop: "0.125rem",
                  flexShrink: 0,
                }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <Button href="/rfq" variant="outline" size="lg" style={{ width: "100%" }}>
          Try Now
        </Button>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          marginTop: "var(--spacing-3xl)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "white",
            marginBottom: "var(--spacing-xl)",
          }}
        >
          Frequently Asked Questions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--spacing-lg)",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              q: "Can I change plans anytime?",
              a: "Yes, upgrade or downgrade your plan at any time. Changes take effect immediately.",
            },
            {
              q: "What happens if I exceed my limit?",
              a: "We'll notify you. You can upgrade or purchase additional analyses as needed.",
            },
            {
              q: "Do you offer discounts for annual plans?",
              a: "Yes, annual plans include 2 months free (17% discount).",
            },
            {
              q: "Is there a free trial?",
              a: "Professional plan includes a 14-day free trial. No credit card required.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              style={{
                padding: "var(--spacing-lg)",
                background: "rgba(30, 41, 59, 0.4)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-primary)",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "white",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                {faq.q}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9375rem",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.6,
                }}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

