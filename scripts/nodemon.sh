PID=$(ps aux | grep _babel-node | sed -n '2p' | awk '{print $2}');

if [ ! -z "$PID" ]; then
  { kill -9 $PID && wait $PID; } 2>/dev/null;
fi;