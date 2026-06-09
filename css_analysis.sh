#!/bin/bash

# Define the 7 core CSS files we're looking for
CORE_CSS=(
    "tailwind.local.min.css"
    "global-fonts.css"
    "sitewide-modernization.css"
    "production-fixes.v20260427.css"
    "production-fixes.css"
    "unified-header.css"
    "homepage-cta-links.css"
    "brightai-ui-hotfix.css"
)

# Create output file
OUTPUT_FILE="css_analysis_report.txt"
echo "CSS Dependencies Analysis - BRIGHTAI Project" > $OUTPUT_FILE
echo "============================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Find all HTML files (excluding node_modules)
HTML_FILES=$(find /Users/yzydalshmry/Desktop/BRIGHTAI -name "*.html" -type f | grep -v node_modules | sort)

# Initialize counters
TOTAL_FILES=$(echo "$HTML_FILES" | wc -l | tr -d ' ')
echo "Total HTML files analyzed: $TOTAL_FILES" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Process each HTML file
FILE_COUNT=0
for html_file in $HTML_FILES; do
    FILE_COUNT=$((FILE_COUNT + 1))
    echo -ne "Processing file $FILE_COUNT of $TOTAL_FILES... \r"
    
    # Get relative path for cleaner output
    rel_path=${html_file#/Users/yzydalshmry/Desktop/BRIGHTAI/}
    
    # Start CSS analysis for this file
    echo "File: $rel_path" >> $OUTPUT_FILE
    echo "----------------------------------------" >> $OUTPUT_FILE
    
    # Check which core CSS files are loaded
    for css_file in "${CORE_CSS[@]}"; do
        if grep -q "$css_file" "$html_file"; then
            echo "✓ $css_file" >> $OUTPUT_FILE
        fi
    done
    
    # Find additional CSS files (any .css not in the core list)
    echo "Additional CSS files:" >> $OUTPUT_FILE
    grep -oE 'href="([^"]*\.css[^"]*)"' "$html_file" | sed 's/href="\([^"]*\)"/\1/' | sort | uniq | while read css; do
        # Skip if it's one of the core files
        is_core=false
        for core in "${CORE_CSS[@]}"; do
            if [[ "$css" == *"$core"* ]]; then
                is_core=true
                break
            fi
        done
        
        if [ "$is_core" = false ]; then
            echo "  + $css" >> $OUTPUT_FILE
        fi
    done
    
    # If no additional CSS, indicate that
    if ! grep -q "  + " $OUTPUT_FILE; then
        echo "  (None)" >> $OUTPUT_FILE
    fi
    
    echo "" >> $OUTPUT_FILE
done

echo "" >> $OUTPUT_FILE
echo "Analysis complete!" >> $OUTPUT_FILE

# Generate summary
echo "" >> $OUTPUT_FILE
echo "SUMMARY" >> $OUTPUT_FILE
echo "=======" >> $OUTPUT_FILE

# Count files that load each core CSS
for css_file in "${CORE_CSS[@]}"; do
    count=$(grep -l "$css_file" $HTML_FILES | wc -l | tr -d ' ')
    echo "$css_file: $count files"
done | sort -t: -k2 -nr >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "Report saved to: $OUTPUT_FILE"