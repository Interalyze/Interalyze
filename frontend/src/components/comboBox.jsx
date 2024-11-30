import React, { useState } from 'react';

function JobTitleInput() {
    const [jobTitle, setJobTitle] = useState(''); // Current input value
    const [filteredTitles, setFilteredTitles] = useState([]); // Filtered dropdown options
    const [jobTitles, setJobTitles] = useState([
        'Software Engineer',
        'Data Scientist',
        'Product Manager',
        'Graphic Designer'
    ]); // Existing job titles
    const [isDropdownVisible, setDropdownVisible] = useState(false); // Visibility of dropdown

    // Handle input changes and filter dropdown options
    const handleInputChange = (e) => {
        const input = e.target.value;
        setJobTitle(input);

        // Filter dropdown options based on the input
        const matchingTitles = jobTitles.filter((title) =>
            title.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredTitles(matchingTitles);
        setDropdownVisible(true); // Ensure the dropdown is visible on typing
    };

    // Handle selection from dropdown
    const handleSelect = (title) => {
        setJobTitle(title); // Set the input value to the selected title
        setDropdownVisible(false); // Close the dropdown
    };

    // Add new job title if not found and close dropdown on blur
    const handleBlur = () => {
        setTimeout(() => setDropdownVisible(false), 150); // Delay to allow click selection
        if (!jobTitles.includes(jobTitle) && jobTitle.trim() !== '') {
            setJobTitles([...jobTitles, jobTitle]); // Add new title
        }
    };

    // Show the dropdown when the input is focused
    const handleFocus = () => {
        const matchingTitles = jobTitles.filter((title) =>
            title.toLowerCase().includes(jobTitle.toLowerCase())
        );
        setFilteredTitles(matchingTitles);
        setDropdownVisible(true); // Ensure dropdown is visible on focus
    };

    return (
        <div style={{ position: 'relative', maxWidth: '300px' }}>
            <input
                type="text"
                value={jobTitle}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Enter job title"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            {isDropdownVisible && filteredTitles.length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        background: 'white',
                        border: '1px solid #ccc',
                        listStyleType: 'none',
                        margin: 0,
                        padding: '8px',
                        width: '100%',
                        maxHeight: '150px',
                        overflowY: 'auto',
                    }}
                >
                    {filteredTitles.map((title) => (
                        <li
                            key={title}
                            onClick={() => handleSelect(title)}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            {title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default JobTitleInput;
