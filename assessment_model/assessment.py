from collections import defaultdict
import csv
import pandas as pd

dataThreatVuln = pd.read_csv('threat-vulnerability.csv')
dataAssetVuln = pd.read_csv('asset-vulnerability.csv')
dataTypeThreat = pd.read_csv('type-threat.csv')
dataOuPriority = pd.read_csv('ou-priority.csv')
dataFuncDep = pd.read_csv('function-dependency.csv')
assetProbFile = open('asset-probability.csv', 'a')
impactLikeFile = open('impact-likelihood.csv', 'a')
writerAssetProb = csv.writer(assetProbFile)
writerImpactLike = csv.writer(impactLikeFile)

# Fill asset probability table
# Comma separated list of vulnerabilities in threats and assets
assetProb = defaultdict()
for index, row in dataAssetVuln.iterrows():
    threatList = dataTypeThreat[dataTypeThreat['Type'] == row['Type']]
    vuln = row['Vulnerability'].split(',')
    vuln_set = set(vuln)
    prob_sum = 0
    for _, row2 in threatList.iterrows():
        vulnList = dataThreatVuln[dataThreatVuln['Threat']
                                  == row2['Threat']]['Vulnerability']
        vuln2 = vulnList.to_string().split(',')
        if (set(vuln2) & vuln_set):
            prob_sum = prob_sum + row2['Probability']
    writerAssetProb.writerow([row['Asset ID'], prob_sum])
    assetProb[row['Asset ID']] = prob_sum


# Dependency resolution using topological sorting
# Comma separated list of function dependencies

# Topological sorting code -- credits: Geeksforgeeks
class FuncGraph:
    def __init__(self, vertices) -> None:
        self.graph = defaultdict(list)
        self.v = vertices

    def addEdge(self, u, v):
        self.graph[u].append(v)

    def neighbor_gen(self, v):
        for k in self.graph[v]:
            yield k

    def nonRecursiveTopologicalSortUtil(self, v, visited, stack):

        # working stack contains key and the corresponding current generator
        working_stack = [(v, self.neighbor_gen(v))]

        while working_stack:
            # get last element from stack
            v, gen = working_stack.pop()
            visited[v] = True

            # run through neighbor generator until it's empty
            for next_neighbor in gen:
                if not visited[next_neighbor]:  # not seen before?
                    # remember current work
                    working_stack.append((v, gen))
                    # restart with new neighbor
                    working_stack.append(
                        (next_neighbor, self.neighbor_gen(next_neighbor)))
                    break
            else:
                # no already-visited neighbor (or no more of them)
                stack.append(v)

    # The function to do Topological Sort.
    def nonRecursiveTopologicalSort(self):
        # Mark all the vertices as not visited
        visited = [False]*self.v

        # result stack
        stack = []

        # Call the helper function to store Topological
        # Sort starting from all vertices one by one
        for i in range(self.v):
            if not (visited[i]):
                self.nonRecursiveTopologicalSortUtil(i, visited, stack)
        return stack


g = FuncGraph(len(dataFuncDep.index))
assetDep = defaultdict(list)
priority = defaultdict(int)
busImpact = defaultdict(int)
for _, row in dataFuncDep.iterrows():
    depFunc = row['Function ID']
    funcString = row['Function Dependency']
    funcList = []
    if (type(funcString) == str):
        funcList = funcString.split(',')
    busImpact[depFunc] = int(row['Business Impact'])
    assetDep[depFunc] = row['Asset Dependency'].split(',')
    for func in funcList:
        g.addEdge(func, depFunc)

stack = g.nonRecursiveTopologicalSort()
for index, node in enumerate(stack):
    priority[node] = index+1

# Impact in function table
risk = 0
for _, row in dataOuPriority.iterrows():
    ouPriority = row['Importance']
    funcList = row['Functions'].split(',')
    for func in funcList:
        prob = 0
        for asset in assetDep[int(func)]:
            prob = prob + assetProb[int(asset)]
        impact = ouPriority*priority[int(func)]*busImpact[int(func)]
        writerImpactLike.writerow([func, impact, prob])
        risk = risk + (impact*prob)

# Calculate risk score

print(risk)
