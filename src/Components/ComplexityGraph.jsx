import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const complexityLatex = {
  "O(1)": "O(1)",
  "O(log n)": "O(\\log N)",
  "O(n)": "O(N)",
  "O(n log n)": "O(N \\log N)",
  "O(n²)": "O(N^2)",
};

const complexityFunctions = {
  "O(1)": (n) => 1,
  "O(log n)": (n) => Math.log2(n),
  "O(n)": (n) => n,
  "O(n log n)": (n) => n * Math.log2(n),
  "O(n²)": (n) => n * n,
};

const inputSizes = Array.from({ length: 50 }, (_, i) => i + 1);

const generateNormalizedData = (fn) => {
  const values = inputSizes.map(fn);
  const maxVal = Math.max(...values);
  return values.map((v) => (v / maxVal) * 100);
};

const baseColors = {
  "O(1)": "rgba(220,220,220,0.22)",
  "O(log n)": "rgba(220,220,220,0.22)",
  "O(n)": "rgba(220,220,220,0.22)",
  "O(n log n)": "rgba(220,220,220,0.22)",
  "O(n²)": "rgba(220,220,220,0.22)",
};

const highlightColors = {
  "O(1)": "#39FF14",
  "O(log n)": "#00fff7",
  "O(n)": "#51a7ff",
  "O(n log n)": "#c770ff",
  "O(n²)": "#a259ff", // LeetCode uses purple for O(n²)
};

export default function ComplexityGraph({ type = 'time' }) {
  const [selectedComplexity, setSelectedComplexity] = useState("O(n²)");
  const [complexityType, setComplexityType] = useState(type);

  // Function to map Gemini's complexity response to our graph format
  const mapComplexityToGraph = (complexityData, complexityType = 'time') => {
    if (!complexityData) return "O(n)";
    
    const complexityValue = complexityType === 'time' ? complexityData.time : complexityData.space;
    if (!complexityValue) return "O(n)";

    const timeComplexity = complexityValue.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    if (timeComplexity.includes('o1') || timeComplexity.includes('constant')) {
      return "O(1)";
    } else if (timeComplexity.includes('olog') || timeComplexity.includes('log')) {
      return "O(log n)";
    } else if (timeComplexity.includes('onlog') || timeComplexity.includes('nlog')) {
      return "O(n log n)";
    } else if (timeComplexity.includes('on2') || timeComplexity.includes('n2') || timeComplexity.includes('quadratic')) {
      return "O(n²)";
    } else if (timeComplexity.includes('on') && !timeComplexity.includes('olog')) {
      return "O(n)";
    } else {
      return "O(n)"; // Default fallback
    }
  };

  // Expose function to window for extension to call
  useEffect(() => {
    window.renderComplexityGraph = (complexityData, type = 'time') => {
      setComplexityType(type);
      const mappedComplexity = mapComplexityToGraph(complexityData, type);
      setSelectedComplexity(mappedComplexity);
    };

    // Listen for messages from extension
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'updateComplexity') {
        const { complexityData, complexityType } = event.data;
        setComplexityType(complexityType || 'time');
        const mappedComplexity = mapComplexityToGraph(complexityData, complexityType || 'time');
        setSelectedComplexity(mappedComplexity);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup function
    return () => {
      delete window.renderComplexityGraph;
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const datasets = Object.entries(complexityFunctions).map(([name, fn]) => {
    const isSelected = name === selectedComplexity;
    return {
      label: name,
      data: generateNormalizedData(fn),
      fill: false,
      borderColor: isSelected ? highlightColors[name] : baseColors[name],
      borderWidth: isSelected ? 3 : 2,
      pointRadius: 0,
      tension: 0.4,
      order: isSelected ? 2 : 1,
    };
  });

  // Subtle, dashed axis grid lines
  const gridStyle = {
    color: '#444',
    borderDash: [5, 6],
    lineWidth: 1,
  };

  const data = {
    labels: inputSizes,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: { tooltip: { enabled: false } },
    scales: {
      x: {
        display: true,
        grid: gridStyle,
        ticks: {
          display: true,
          color: "#bbb",
          font: { size: 11 },
          maxTicksLimit: 5,
        },
        min: 0,
        max: inputSizes.length - 1,
      },
      y: {
        display: true,
        grid: gridStyle,
        ticks: {
          display: true,
          color: "#bbb",
          font: { size: 11 },
          maxTicksLimit: 5,
          stepSize: 20,
          padding: 2,
        },
        min: 0,
        max: 100,
      },
    },
    elements: {
      line: { borderJoinStyle: "round" },
    },
  };

  return (
    <div style={{
      background: "#19191C",
      borderRadius: 0,
      width: 340,
      margin: "0",
      padding: "10px 0",
      boxShadow: "none",
      textAlign: "center",
      position: "relative"
    }}>
      <div style={{
        fontSize: 18,
        color: "#ffffff",
        paddingTop: 8,
        fontWeight: 600,
        letterSpacing: '0.01em'
      }}>
        {complexityType === 'time' ? 'Time Complexity' : 'Space Complexity'}
      </div>
      <div style={{ paddingTop: 10, paddingBottom: 6, color:'whitesmoke' }}>
        <BlockMath math={complexityLatex[selectedComplexity]} />
      </div>
      <div style={{
        height: 180,
        width: 200,
        margin: "12px auto 16px auto",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
