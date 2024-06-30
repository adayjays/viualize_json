document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/dashboard-data')
        .then(response => response.json())
        .then(data => {
            createBrandComparisonChart(data.brandComparison);
            createFeatureDistributionCharts(data.featureDistribution);
        })
        .catch(error => console.error('Error loading dashboard data:', error));
});

function createBrandComparisonChart(data) {
    const ctx = document.getElementById('brandComparisonChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Original Devices',
                    data: data.original,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                },
                {
                    label: 'Replacement Options',
                    data: data.replacement,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Brand Comparison: Original vs Replacement'
                }
            }
        }
    });
}

function createFeatureDistributionCharts(data) {
    createScreenSizeChart(data.screenSize);
    createPriceDistributionChart(data.price);
}

function createScreenSizeChart(data) {
    const ctx = document.getElementById('screenSizeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Change type to 'bar' for histogram-like appearance
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Screen Size Distribution',
                data: data.data,
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Use background color for bars
                borderColor: 'rgb(75, 192, 192)', // Optional: Use border color if needed
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Screen Size Distribution of Replacement Options'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Screen Size (inches)'
                    },
                    ticks: { // Adjusting tick settings for better histogram look
                        min: Math.min(...data.data), // Set minimum value to the smallest data point
                        max: Math.max(...data.data), // Set maximum value to the largest data point
                        autoSkip: false, // Prevent skipping labels
                        maxRotation: 0, // Rotate labels 0 degrees
                        minRotation: 0 // Rotate labels 0 degrees
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                }
            }
        }
    });
}


function createPriceDistributionChart(data) {
    const ctx = document.getElementById('priceDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Price Distribution of Replacement Options'
                }
            }
        }
    });
}
function createSatisfactionTrendChart(data) {
    const ctx = document.getElementById('satisfactionTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Customer Satisfaction Trend',
                data: data.data,
                borderColor: 'rgba(75, 192, 192, 0.6)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Customer Satisfaction Trend Over Time'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Satisfaction Level'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

function createBrandLoyaltyChart(data) {
    const ctx = document.getElementById('brandLoyaltyChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut', // or 'pie' for Pie Chart
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Brand Loyalty',
                data: data.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Brand Loyalty Distribution'
                }
            }
        }
    });
}

function createPreferenceTrendChart(data) {
    const ctx = document.getElementById('preferenceTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // or 'bar' for Stacked Bar Chart
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Preference Shifts Over Time',
                data: data.data,
                borderColor: 'rgba(255, 99, 132, 0.6)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Preference Shifts Over Time'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Shift Rate'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

function createReplacementEffectivenessChart(data) {
    const ctx = document.getElementById('replacementEffectivenessChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // or 'line' for Line Chart
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Replacement Effectiveness',
                data: data.data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Replacement Effectiveness Comparison'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Devices'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Effectiveness'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

function createCompetitiveAnalysisChart(data) {
    const ctx = document.getElementById('competitiveAnalysisChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // or 'radar' for Radar Chart
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Competitive Analysis',
                data: data.data,
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Competitive Analysis'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Factors'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Score'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}
