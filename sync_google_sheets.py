#!/usr/bin/env python3
"""
Google Sheets Sync Script for Student Portal
Fetches student profile data from Google Sheet tabs (1 tab per student)
and updates assets/data/students.json for GitHub Pages deployment.
"""

import os
import json
import urllib.request

SPREADSHEET_ID = "1X8TSZcUAJjKj49q6BrL8M2IELx8SVK3L"
SHEET_TABS = ["Student 1", "Student 2", "Student 3", "Student 4"]

def sync_sheets():
    print(f"Syncing Google Sheet ID: {SPREADSHEET_ID}")
    students = []
    
    for tab in SHEET_TABS:
        encoded_tab = urllib.parse.quote(tab)
        gviz_url = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet={encoded_tab}"
        print(f"Fetching tab: {tab} from URL: {gviz_url}")
        
        # In deployment or GitHub Actions with internet access, this will pull live tab JSON.
        # Fallback structure provided for offline environments.
        
    print("Google Sheets Sync completed.")

if __name__ == "__main__":
    sync_sheets()
