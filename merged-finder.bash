for dir in */; do
  if [ -d "$dir/merged" ]; then
    echo "$dir"
  fi
done