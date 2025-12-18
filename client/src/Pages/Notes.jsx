import React, { useEffect, useState } from 'react';
import { getNotesByJourney } from '../Api/notes'; // Import the API function
import { useParams } from 'react-router-dom';
import { getJourneyById } from '../Api/journeys';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { downloadLogo } from '../Constants';

const Notes = () => {
  const { journeyId } = useParams(); // Get the journeyId from URL params
  const [notes, setNotes] = useState([]);
  const [jData, setJData] = useState({});
  const [error, setError] = useState(null);

  // Fetch the notes when the component mounts
  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getNotesByJourney(journeyId);
      const fetchJourney = await getJourneyById(journeyId);
      setNotes(fetchedNotes);
      setJData(fetchJourney);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes(); // Fetch notes on component mount
  }, [journeyId]); // Re-run if journeyId changes

  // Function to handle PDF generation and download
  const downloadPDF = () => {
    const input = document.getElementById('notesContent'); // Target the notes content for PDF

    // Temporarily change text color to black for better PDF visibility
    input.style.color = 'black';

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Create new jsPDF object (A4 size)
      const imgWidth = 210; // A4 page width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Add the image data to PDF
      pdf.save(`${jData.title}_Notes.pdf`); // Save the PDF with the journey title

      // Revert text color back to white after PDF generation
      input.style.color = '';
    });
  };

  // Render the notes or a message if there's an error or no notes
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Notes</h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {notes.length === 0 && !error ? (
            <div className='flex justify-center text-xl font-semibold items-center w-full h-[50vh] text-gray-600 dark:text-gray-300'>
              No notes available for {jData ? jData.title : 'this journey'}.
            </div>
          ) : (
            <>
              <button
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mb-6 flex items-center gap-2 transition-colors"
              >
                <span>Download PDF</span>
                <img src={downloadLogo} className="invert" width={'25px'} alt="" />
              </button>
              <div id="notesContent" className="space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Notes for {jData.title}
                </h2>
                <div className="space-y-4">
                  {notes.map(note => (
                    <div key={note.id} className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      {/* Display HTML content using dangerouslySetInnerHTML */}
                      <div
                        className="text-lg font-medium text-gray-900 dark:text-white prose prose-gray dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                        onClick={(e) => {
                          // Handle clicks on links within the notes content
                          if (e.target.tagName === 'A') {
                            e.preventDefault();
                            const href = e.target.getAttribute('href');
                            if (href) {
                              // Check if it's an external link (starts with http:// or https://)
                              if (href.startsWith('http://') || href.startsWith('https://')) {
                                window.open(href, '_blank', 'noopener,noreferrer');
                              } else {
                                // For relative links, you can handle them differently if needed
                                window.open(href, '_blank', 'noopener,noreferrer');
                              }
                            }
                          }
                        }}
                      />
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        Created: {new Date(note.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
