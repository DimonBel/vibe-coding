#!/usr/bin/env python3
"""
Run script for the Flask application
"""
import os
import sys

# Add the parent directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from backend import create_app
    app = create_app()
    
    if __name__ == '__main__':
        app.run(debug=True, port=5000, host='0.0.0.0')
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure you're running this from the project root directory")
    sys.exit(1) 