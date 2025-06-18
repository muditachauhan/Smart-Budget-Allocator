from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/allocate', methods=['POST'])
def allocate():
    data = request.get_json()
    budget = int(data['budget'])
    expenses = data['expenses']
    
    # Subset Sum Allocation
    n = len(expenses)
    dp = [[[] for _ in range(budget + 1)] for _ in range(n + 1)]
    for i in range(n + 1):
        for w in range(budget + 1):
            if i == 0 or w == 0:
                dp[i][w] = []
            elif expenses[i - 1]['cost'] <= w:
                include = dp[i - 1][w - expenses[i - 1]['cost']] + [expenses[i - 1]]
                exclude = dp[i - 1][w]
                dp[i][w] = include if sum(e['cost'] for e in include) > sum(e['cost'] for e in exclude) else exclude
            else:
                dp[i][w] = dp[i - 1][w]

    result = dp[n][budget]
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
