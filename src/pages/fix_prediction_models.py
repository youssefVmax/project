import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

class AdvancedSalesPredictionModel:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.data = None
        self.monthly_data = None
        self.models = {}
        self.predictions = {}
        
    def load_and_preprocess_data(self):
        """Load and preprocess the sales data"""
        try:
            self.data = pd.read_csv(self.csv_path)
            
            # Convert signup_date to datetime - it's already in YYYY-MM-DD format
            self.data['signup_date'] = pd.to_datetime(self.data['signup_date'], errors='coerce')
            
            # Filter out invalid dates
            self.data = self.data.dropna(subset=['signup_date'])
            
            # Ensure we only have April, May, June, and July 1st data as requested
            self.data = self.data[
                ((self.data['signup_date'].dt.month == 4) & (self.data['signup_date'].dt.year == 2025)) |
                ((self.data['signup_date'].dt.month == 5) & (self.data['signup_date'].dt.year == 2025)) |
                ((self.data['signup_date'].dt.month == 6) & (self.data['signup_date'].dt.year == 2025)) |
                ((self.data['signup_date'].dt.month == 7) & (self.data['signup_date'].dt.day == 1) & (self.data['signup_date'].dt.year == 2025))
            ]
            
            print(f"Loaded {len(self.data)} records from April-June 2025 and July 1st")
            
            if len(self.data) == 0:
                print("No data found for the specified date range. Checking available dates...")
                all_dates = pd.to_datetime(pd.read_csv(self.csv_path)['signup_date'], errors='coerce')
                print(f"Date range in data: {all_dates.min()} to {all_dates.max()}")
                print(f"Unique months: {sorted(all_dates.dt.month.unique())}")
                print(f"Unique years: {sorted(all_dates.dt.year.unique())}")
                
                # Use all available data if no data in specified range
                self.data = pd.read_csv(self.csv_path)
                self.data['signup_date'] = pd.to_datetime(self.data['signup_date'], errors='coerce')
                self.data = self.data.dropna(subset=['signup_date'])
                print(f"Using all available data: {len(self.data)} records")
            
            # Create monthly aggregations
            self.create_monthly_aggregations()
            
            return True
            
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def create_monthly_aggregations(self):
        """Create monthly aggregated data for analysis"""
        self.data['year_month'] = self.data['signup_date'].dt.to_period('M')
        
        # Aggregate by month
        monthly_agg = self.data.groupby('year_month').agg({
            'amount_paid': ['sum', 'mean', 'count'],
            'sales_agent': 'nunique',
            'closing_agent': 'nunique',
            'country': 'nunique',
            'product_type': lambda x: x.mode().iloc[0] if len(x.mode()) > 0 else 'Unknown',
            'customer_age_days': 'mean',
            'paid_per_day': 'mean'
        }).round(2)
        
        # Flatten column names
        monthly_agg.columns = [
            'total_revenue', 'avg_deal_size', 'total_deals',
            'unique_agents', 'unique_closers', 'unique_countries',
            'top_product', 'avg_customer_age', 'avg_daily_revenue'
        ]
        
        # Reset index to make year_month a column
        self.monthly_data = monthly_agg.reset_index()
        self.monthly_data['month_num'] = range(1, len(self.monthly_data) + 1)
        
        print("Monthly aggregations created:")
        print(self.monthly_data)
    
    def linear_trend_prediction(self, target_column, months_ahead):
        """Simple linear trend prediction"""
        if self.monthly_data is None or len(self.monthly_data) < 2:
            return None
            
        X = self.monthly_data['month_num'].values.reshape(-1, 1)
        y = self.monthly_data[target_column].values
        
        # Fit linear regression
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict future months
        future_months = np.arange(len(self.monthly_data) + 1, len(self.monthly_data) + months_ahead + 1).reshape(-1, 1)
        predictions = model.predict(future_months)
        
        # Ensure non-negative predictions
        predictions = np.maximum(predictions, 0)
        
        # Calculate confidence based on R-squared
        r_squared = model.score(X, y)
        confidence = max(0.5, min(0.95, r_squared))
        
        return {
            'predictions': predictions.tolist(),
            'confidence': confidence,
            'trend_slope': model.coef_[0],
            'r_squared': r_squared
        }
    
    def polynomial_trend_prediction(self, target_column, months_ahead, degree=2):
        """Polynomial trend prediction for non-linear patterns"""
        if self.monthly_data is None or len(self.monthly_data) < 3:
            return None
            
        X = self.monthly_data['month_num'].values.reshape(-1, 1)
        y = self.monthly_data[target_column].values
        
        # Create polynomial features
        poly_features = PolynomialFeatures(degree=degree)
        X_poly = poly_features.fit_transform(X)
        
        # Fit polynomial regression
        model = LinearRegression()
        model.fit(X_poly, y)
        
        # Predict future months
        future_months = np.arange(len(self.monthly_data) + 1, len(self.monthly_data) + months_ahead + 1).reshape(-1, 1)
        future_months_poly = poly_features.transform(future_months)
        predictions = model.predict(future_months_poly)
        
        # Ensure non-negative predictions
        predictions = np.maximum(predictions, 0)
        
        # Calculate confidence
        r_squared = model.score(X_poly, y)
        confidence = max(0.5, min(0.95, r_squared * 0.9))  # Slightly lower confidence for polynomial
        
        return {
            'predictions': predictions.tolist(),
            'confidence': confidence,
            'r_squared': r_squared
        }
    
    def seasonal_adjustment_prediction(self, target_column, months_ahead):
        """Seasonal adjustment with trend analysis"""
        if self.monthly_data is None:
            return None
            
        # Define seasonal factors (higher in Q1 and Q4, lower in summer)
        seasonal_factors = {
            1: 1.15, 2: 1.10, 3: 1.05,  # Q1 - High
            4: 1.00, 5: 0.95, 6: 0.90,  # Q2 - Medium
            7: 0.85, 8: 0.80, 9: 0.85,  # Q3 - Low (Summer)
            10: 1.05, 11: 1.10, 12: 1.20  # Q4 - High (Holiday season)
        }
        
        # Get base trend prediction
        linear_pred = self.linear_trend_prediction(target_column, months_ahead)
        if linear_pred is None:
            return None
            
        # Apply seasonal adjustments
        current_month = 7  # Starting from July 2025
        seasonal_predictions = []
        
        for i, base_pred in enumerate(linear_pred['predictions']):
            month = ((current_month + i - 1) % 12) + 1
            seasonal_factor = seasonal_factors.get(month, 1.0)
            seasonal_pred = base_pred * seasonal_factor
            seasonal_predictions.append(max(0, seasonal_pred))  # Ensure non-negative
        
        return {
            'predictions': seasonal_predictions,
            'confidence': linear_pred['confidence'] * 0.95,  # Slightly lower confidence
            'seasonal_factors_used': [seasonal_factors.get(((current_month + i - 1) % 12) + 1, 1.0) for i in range(months_ahead)],
            'base_trend_slope': linear_pred['trend_slope']
        }
    
    def agent_performance_prediction(self, months_ahead):
        """Predict agent and closer performance"""
        if self.data is None:
            return None
            
        # Aggregate agent performance
        agent_stats = self.data.groupby('sales_agent').agg({
            'amount_paid': ['sum', 'count', 'mean'],
            'customer_age_days': 'mean'
        }).round(2)
        
        agent_stats.columns = ['total_revenue', 'total_deals', 'avg_deal_size', 'avg_customer_age']
        agent_stats = agent_stats.reset_index()
        
        # Calculate months of data available
        months_of_data = len(self.monthly_data) if self.monthly_data is not None else 3
        
        # Predict future performance based on current trends
        agent_predictions = []
        for _, agent in agent_stats.iterrows():
            # Simple growth prediction based on current performance
            monthly_deals = agent['total_deals'] / months_of_data
            monthly_revenue = agent['total_revenue'] / months_of_data
            
            # Apply growth factor (10% growth assumption)
            growth_factor = 1.1
            
            predicted_deals = []
            predicted_revenue = []
            
            for month in range(1, months_ahead + 1):
                deals = monthly_deals * (growth_factor ** (month / 12))
                revenue = monthly_revenue * (growth_factor ** (month / 12))
                predicted_deals.append(max(0, deals))
                predicted_revenue.append(max(0, revenue))
            
            agent_predictions.append({
                'agent_name': agent['sales_agent'],
                'current_performance': {
                    'total_revenue': agent['total_revenue'],
                    'total_deals': agent['total_deals'],
                    'avg_deal_size': agent['avg_deal_size']
                },
                'predicted_monthly_deals': predicted_deals,
                'predicted_monthly_revenue': predicted_revenue
            })
        
        # Sort by current performance
        agent_predictions.sort(key=lambda x: x['current_performance']['total_revenue'], reverse=True)
        
        return agent_predictions[:15]  # Top 15 agents
    
    def program_revenue_prediction(self, months_ahead):
        """Predict revenue by program/product type"""
        if self.data is None:
            return None
            
        # Aggregate by product type
        program_stats = self.data.groupby('product_type').agg({
            'amount_paid': ['sum', 'count', 'mean']
        }).round(2)
        
        program_stats.columns = ['total_revenue', 'total_deals', 'avg_deal_size']
        program_stats = program_stats.reset_index()
        
        # Calculate months of data available
        months_of_data = len(self.monthly_data) if self.monthly_data is not None else 3
        
        # Predict future performance
        program_predictions = []
        for _, program in program_stats.iterrows():
            monthly_revenue = program['total_revenue'] / months_of_data
            
            # Different growth rates for different programs
            if 'ibo' in program['product_type'].lower():
                growth_factor = 1.12  # Higher growth for IBO
            elif 'bob' in program['product_type'].lower():
                growth_factor = 1.08  # Medium growth for BOB
            else:
                growth_factor = 1.05  # Conservative growth for others
            
            predicted_revenue = []
            for month in range(1, months_ahead + 1):
                revenue = monthly_revenue * (growth_factor ** (month / 12))
                predicted_revenue.append(max(0, revenue))
            
            program_predictions.append({
                'program_name': program['product_type'],
                'current_revenue': program['total_revenue'],
                'predicted_monthly_revenue': predicted_revenue,
                'growth_factor': growth_factor
            })
        
        # Sort by current revenue
        program_predictions.sort(key=lambda x: x['current_revenue'], reverse=True)
        
        return program_predictions
    
    def generate_comprehensive_predictions(self, months_options=[3, 6, 12]):
        """Generate comprehensive predictions for all requested time periods"""
        if not self.load_and_preprocess_data():
            return None
        
        results = {}
        
        for months in months_options:
            print(f"\nGenerating predictions for {months} months ahead...")
            
            # Revenue predictions
            linear_revenue = self.linear_trend_prediction('total_revenue', months)
            poly_revenue = self.polynomial_trend_prediction('total_revenue', months)
            seasonal_revenue = self.seasonal_adjustment_prediction('total_revenue', months)
            
            # Deals predictions
            linear_deals = self.linear_trend_prediction('total_deals', months)
            seasonal_deals = self.seasonal_adjustment_prediction('total_deals', months)
            
            # Agent performance predictions
            agent_predictions = self.agent_performance_prediction(months)
            
            # Program revenue predictions
            program_predictions = self.program_revenue_prediction(months)
            
            results[f'{months}_months'] = {
                'revenue_predictions': {
                    'linear': linear_revenue,
                    'polynomial': poly_revenue,
                    'seasonal': seasonal_revenue
                },
                'deals_predictions': {
                    'linear': linear_deals,
                    'seasonal': seasonal_deals
                },
                'agent_predictions': agent_predictions,
                'program_predictions': program_predictions,
                'prediction_period': months,
                'base_data_period': f'{self.monthly_data["year_month"].min()} to {self.monthly_data["year_month"].max()}' if self.monthly_data is not None and len(self.monthly_data) > 0 else 'No data',
                'prediction_start_date': '2025-07-01'
            }
        
        return results
    
    def save_predictions_to_json(self, predictions, output_path):
        """Save predictions to JSON file"""
        try:
            with open(output_path, 'w') as f:
                json.dump(predictions, f, indent=2, default=str)
            print(f"Predictions saved to {output_path}")
            return True
        except Exception as e:
            print(f"Error saving predictions: {e}")
            return False

# Main execution
if __name__ == "__main__":
    # Initialize the prediction model
    model = AdvancedSalesPredictionModel('/home/ubuntu/cleaned_prediction_data.csv')
    
    # Generate comprehensive predictions
    predictions = model.generate_comprehensive_predictions([3, 6, 12])
    
    if predictions:
        # Save to JSON file
        model.save_predictions_to_json(predictions, '/home/ubuntu/advanced_predictions.json')
        
        # Print summary
        print("\n" + "="*60)
        print("ADVANCED PREDICTION SUMMARY")
        print("="*60)
        
        for period, data in predictions.items():
            print(f"\n{period.upper()} PREDICTIONS:")
            
            # Revenue summary
            if data['revenue_predictions']['seasonal']:
                seasonal_rev = data['revenue_predictions']['seasonal']['predictions']
                total_predicted = sum(seasonal_rev)
                print(f"  Total Predicted Revenue: ${total_predicted:,.2f}")
                print(f"  Average Monthly Revenue: ${total_predicted/len(seasonal_rev):,.2f}")
                print(f"  Confidence Level: {data['revenue_predictions']['seasonal']['confidence']:.1%}")
            
            # Deals summary
            if data['deals_predictions']['seasonal']:
                seasonal_deals = data['deals_predictions']['seasonal']['predictions']
                total_deals = sum(seasonal_deals)
                print(f"  Total Predicted Deals: {total_deals:.0f}")
                print(f"  Average Monthly Deals: {total_deals/len(seasonal_deals):.1f}")
            
            # Top agents
            if data['agent_predictions']:
                top_agent = data['agent_predictions'][0]
                print(f"  Top Predicted Agent: {top_agent['agent_name']}")
                print(f"  Agent Predicted Revenue: ${sum(top_agent['predicted_monthly_revenue']):,.2f}")
            
            # Top program
            if data['program_predictions']:
                top_program = data['program_predictions'][0]
                print(f"  Top Predicted Program: {top_program['program_name']}")
                print(f"  Program Predicted Revenue: ${sum(top_program['predicted_monthly_revenue']):,.2f}")
        
        print("\n" + "="*60)
        print("Predictions generated successfully!")
        print("Files created:")
        print("- /home/ubuntu/advanced_predictions.json")
        print("="*60)
    
    else:
        print("Failed to generate predictions. Please check the data and try again.")

