import os

# Get the current working directory (where the script is located)
current_directory = os.path.dirname(os.path.abspath(__file__))

# Read the list of team pairs from list.txt in the current directory
with open(os.path.join(current_directory, 'list.txt'), 'r') as f:
    team_pairs = [line.strip() for line in f.readlines()]

# Specify the output folder in the current directory
output_folder = os.path.join(current_directory, 'output_results')

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Loop through team pairs and create modified HTML files
for team_pair in team_pairs:
    teams = team_pair.split(' vs ')
    
    # Check the number of teams in the line
    if len(teams) == 1:
        team_a, team_b = teams[0], ''  # Set team_b as an empty string
    else:
        team_a, team_b = teams

    # Remove periods and convert to lowercase for file naming
    team_a_filename = team_a.replace('.', '').lower().replace(' ', '-')

    # Generate the correct file names based on team names
    file_names = [f'video-{team_a_filename}-live-tv-kat-{i:02d}.html' for i in range(1, 6)]
    
    # Construct the full paths to the original HTML template files
    template_file_paths = [os.path.join(current_directory, f'video-free-live-tv-kat-{i:02d}.html') for i in range(1, 6)]

    # Read the HTML template files
    html_templates = []
    for template_file_path in template_file_paths:
        with open(template_file_path, 'r', encoding='utf-8') as template_file:
            html_templates.append(template_file.read())

    # Loop through each file name and template
    for file_name, html_template in zip(file_names, html_templates):
        # Replace specific team names in the HTML template
        modified_html = html_template.replace('North Little Rock', team_a)
        
        # Write the modified HTML to the output file in the output folder
        with open(os.path.join(output_folder, file_name), 'w', encoding='utf-8') as output_file:
            output_file.write(modified_html)

        print(f"HTML file '{file_name}' created for {team_a} vs {team_b}.")
