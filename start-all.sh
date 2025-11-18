#!/bin/bash

# Ecommerce Microservices Startup Script
# This script starts all 5 services required for the application

# Get the absolute path to the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting all microservices..."
echo "================================"
echo ""

# Store the PIDs so we can kill them on exit
pids=()

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down all services..."
    for pid in "${pids[@]}"; do
        kill -9 "$pid" 2>/dev/null
    done
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Start Database Service (Port 3004)
echo "[1/5] Starting Database Service on port 3004..."
(cd "$SCRIPT_DIR/database-service" && npm run dev > "$SCRIPT_DIR/logs/database-service.log" 2>&1) &
pids+=($!)

sleep 2

# Start Product Service (Port 3001)
echo "[2/5] Starting Product Service on port 3001..."
(cd "$SCRIPT_DIR/product-service" && npm run dev > "$SCRIPT_DIR/logs/product-service.log" 2>&1) &
pids+=($!)

sleep 2

# Start Order Service (Port 3002)
echo "[3/5] Starting Order Service on port 3002..."
(cd "$SCRIPT_DIR/order-service" && npm run dev > "$SCRIPT_DIR/logs/order-service.log" 2>&1) &
pids+=($!)

sleep 2

# Start User Service (Port 3003)
echo "[4/5] Starting User Service on port 3003..."
(cd "$SCRIPT_DIR/user-service" && npm run dev > "$SCRIPT_DIR/logs/user-service.log" 2>&1) &
pids+=($!)

sleep 2

# Start Frontend (Port 3000)
echo "[5/5] Starting Frontend on port 3000..."
(cd "$SCRIPT_DIR/frontend" && npm run dev > "$SCRIPT_DIR/logs/frontend.log" 2>&1) &
pids+=($!)

echo ""
echo "================================"
echo "All services started!"
echo "================================"
echo ""
echo "Services running on:"
echo "  - Frontend:         http://localhost:3000"
echo "  - Product Service:  http://localhost:3001"
echo "  - Order Service:    http://localhost:3002"
echo "  - User Service:     http://localhost:3003"
echo "  - Database Service: http://localhost:3004"
echo ""
echo "To access from your local machine, run this SSH command:"
echo "  ssh -L 3000:localhost:3000 -L 3001:localhost:3001 -L 3002:localhost:3002 -L 3003:localhost:3003 -L 3004:localhost:3004 sy-user@<YOUR_GCP_EXTERNAL_IP>"
echo ""
echo "Logs are being written to the logs/ directory"
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait
