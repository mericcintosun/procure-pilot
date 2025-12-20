#!/bin/bash

# Check current chaincode sequence before redeploy
# Usage: ./scripts/check-chaincode-sequence.sh

cd "$(dirname "$0")/../fabric/fabric-samples/test-network" || exit 1

echo "=== Checking Chaincode Sequence ==="
echo ""

# Query committed chaincode
peer lifecycle chaincode querycommitted \
  -C mychannel \
  -n procureaudit \
  --output json 2>/dev/null | jq -r '.sequence // "Not found"'

echo ""
echo "Next deployment should use sequence: (current + 1)"

