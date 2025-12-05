#!/bin/bash

echo "========================================"
echo "  AutoRoulette Starting..."
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "[ERROR] .env file not found!"
    echo ""
    echo "Please copy .env.example to .env and configure your settings:"
    echo "  cp .env.example .env"
    echo ""
    echo "Then edit .env and add your Chzzk authentication tokens."
    echo ""
    exit 1
fi

echo "[INFO] Starting Docker containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to start Docker containers."
    echo "Please make sure Docker is running."
    echo ""
    exit 1
fi

echo ""
echo "========================================"
echo "  AutoRoulette Started Successfully!"
echo "========================================"
echo ""
echo "Services are now running:"
echo "  - Roulette UI:  http://localhost:1235/"
echo "  - Admin Panel:  http://localhost:3000/admin"
echo "  - Backend API:  http://localhost:3000"
echo ""
echo "To stop the services, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
echo ""
