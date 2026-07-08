package main

import (
	"fmt"
	"log"
	"net/http"
)

func handleTelemetry(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprintf(w, "Telemetry received successfully")
}

func main() {
	http.HandleFunc("/api/v1/telemetry", handleTelemetry)
	log.Println("Go Telemetry Service is running on port 8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
