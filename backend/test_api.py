"""
Quick API Test Script for BlueMind Backend

Run this script to verify the API is working correctly.
Make sure the backend is running first!
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_health():
    """Test health endpoint"""
    response = requests.get("http://localhost:8000/health")
    print(f"✓ Health Check: {response.json()}")
    return response.status_code == 200

def test_signup():
    """Test user signup"""
    data = {
        "email": "test@bluemind.org",
        "password": "testpassword123",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=data)
    if response.status_code == 201:
        print(f"✓ Signup successful: {response.json()['email']}")
        return True
    elif response.status_code == 400:
        print("✓ User already exists (expected)")
        return True
    return False

def test_login():
    """Test user login"""
    data = {
        "email": "test@bluemind.org",
        "password": "testpassword123"
    }
    response = requests.post(f"{BASE_URL}/auth/login-json", json=data)
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"✓ Login successful: Token received")
        return token
    return None

def test_create_simulation(token):
    """Test creating a simulation"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": "Test Simulation",
        "description": "API test simulation",
        "temperature": 22.0,
        "nutrients": 60.0,
        "light": 80.0
    }
    response = requests.post(f"{BASE_URL}/simulations", json=data, headers=headers)
    if response.status_code == 201:
        sim = response.json()
        print(f"✓ Simulation created: ID {sim['id']}")
        return sim['id']
    return None

def test_step_simulation(token, sim_id):
    """Test stepping through simulation"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/simulations/{sim_id}/step?weeks=2", headers=headers)
    if response.status_code == 200:
        sim = response.json()
        print(f"✓ Simulation stepped: Week {sim['week']}, Health Score {sim['ecosystem_health_score']}")
        return True
    return False

def test_predictions(token, sim_id):
    """Test AI predictions"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/simulations/{sim_id}/predict?weeks_ahead=4", headers=headers)
    if response.status_code == 200:
        pred = response.json()
        print(f"✓ Predictions generated: Carbon seq. rate {pred['carbon_sequestration_rate']:.4f} kg CO2/week")
        print(f"  Recommendations: {pred['recommendations'][0] if pred['recommendations'] else 'None'}")
        return True
    return False

def test_dashboard_stats(token):
    """Test dashboard statistics"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    if response.status_code == 200:
        stats = response.json()
        print(f"✓ Dashboard stats: {stats['total_simulations']} simulations, "
              f"{stats['average_ecosystem_health']:.1f}% avg health")
        return True
    return False

def main():
    """Run all tests"""
    print("🧪 BlueMind API Test Suite")
    print("=" * 50)
    
    try:
        print("\n1. Testing Health Check...")
        if not test_health():
            print("❌ Health check failed!")
            return
        
        print("\n2. Testing User Signup...")
        if not test_signup():
            print("❌ Signup failed!")
            return
        
        print("\n3. Testing User Login...")
        token = test_login()
        if not token:
            print("❌ Login failed!")
            return
        
        print("\n4. Testing Simulation Creation...")
        sim_id = test_create_simulation(token)
        if not sim_id:
            print("❌ Simulation creation failed!")
            return
        
        print("\n5. Testing Simulation Step...")
        if not test_step_simulation(token, sim_id):
            print("❌ Simulation step failed!")
            return
        
        print("\n6. Testing AI Predictions...")
        if not test_predictions(token, sim_id):
            print("❌ Predictions failed!")
            return
        
        print("\n7. Testing Dashboard Stats...")
        if not test_dashboard_stats(token):
            print("❌ Dashboard stats failed!")
            return
        
        print("\n" + "=" * 50)
        print("✅ All tests passed! Backend is working correctly!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to backend!")
        print("Make sure the backend is running at http://localhost:8000")
        print("Run: cd backend && ./start.sh")
    except Exception as e:
        print(f"\n❌ Test error: {e}")

if __name__ == "__main__":
    main()
