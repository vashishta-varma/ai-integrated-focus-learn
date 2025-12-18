import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { createJourney, createJourneyWithPlaylist, getAllJourneys } from "../../Api/journeys";
import { useNavigate } from "react-router-dom";
import { extractPlaylistId } from "../../Constants";

const CreateJourney = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [description, setDescription] = useState("");
  const [is_public, setIsPublic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const journeyData = {
      title,
      description,
      is_public,
    };
    console.log(journeyData);

    try {
      const result = await createJourney(journeyData);
      await getAllJourneys();
      console.log(result);
      setOpen(!open);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  const createWithPlayist = async (e) => {
    e.preventDefault();
    const journeyData = {
      playlistId : extractPlaylistId(playlist),
      is_public,
    };
    console.log(journeyData);

    try {
      const result = await createJourneyWithPlaylist(journeyData);
      await getAllJourneys();
      console.log(result);
      setOpen(!open);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 w-full max-w-6xl">
            <div className="bg-gray-800 px-6 py-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Form to create custom journey */}
                <div className="flex-1 bg-gray-700 rounded-lg p-6 shadow-lg border border-gray-600">
                  <h2 className="mb-6 text-2xl font-bold text-center text-white">
                    Create Custom Journey
                  </h2>
              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              >
                <div>
                  <label
                    htmlFor="jn"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Journey Name
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="jn"
                    className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 placeholder-gray-400"
                    placeholder="Enter journey name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    rows="4"
                    placeholder="Describe your learning journey..."
                    className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 placeholder-gray-400 resize-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="Visibility"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Visibility
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="custom-private"
                        name="custom-visibility"
                        value="private"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        onChange={(e) => setIsPublic(false)}
                        checked={!is_public}
                        required
                      />
                      <label
                        htmlFor="custom-private"
                        className="ml-2 text-sm font-medium text-gray-300"
                      >
                        Private
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="custom-public"
                        name="custom-visibility"
                        value="public"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        onChange={(e) => setIsPublic(true)}
                        checked={is_public}
                        required
                      />
                      <label
                        htmlFor="custom-public"
                        className="ml-2 text-sm font-medium text-gray-300"
                      >
                        Public
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Done
                </button>
              </form>
            </div>

                {/* OR separator */}
                <div className="flex items-center justify-center lg:flex-col lg:justify-center">
                  <div className="flex items-center">
                    <div className="border-t border-gray-600 flex-1 lg:border-t-0 lg:border-l lg:h-8"></div>
                    <span className="px-4 text-xl font-bold text-gray-300 lg:py-4 lg:px-0">OR</span>
                    <div className="border-t border-gray-600 flex-1 lg:border-t-0 lg:border-l lg:h-8"></div>
                  </div>
                </div>

                {/* Form to create with playlist */}
                <div className="flex-1 bg-gray-700 rounded-lg p-6 shadow-lg border border-gray-600">
                  <h2 className="mb-6 text-2xl font-bold text-center text-white">
                    Create with Playlist
                  </h2>
              <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" 
              onSubmit={(e)=>createWithPlayist(e)}
              >
                <div>
                  <label
                    htmlFor="playlist"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Playlist URL
                  </label>
                  <input
                    type="text"
                    value={playlist}
                    onChange={(e) => setPlaylist(e.target.value)}
                    name="playlist"
                    placeholder="https://www.youtube.com/playlist?list=..."
                    className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="Visibility"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Visibility
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="playlist-private"
                        name="playlist-visibility"
                        value="private"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        onChange={() => setIsPublic(false)}
                        checked={!is_public}
                        required
                      />
                      <label
                        htmlFor="playlist-private"
                        className="ml-2 text-sm font-medium text-gray-300"
                      >
                        Private
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="playlist-public"
                        name="playlist-visibility"
                        value="public"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        onChange={() => setIsPublic(true)}
                        checked={is_public}
                        required
                      />
                      <label
                        htmlFor="playlist-public"
                        className="ml-2 text-sm font-medium text-gray-300"
                      >
                        Public
                      </label>
                    </div>
                  </div>
                </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors duration-200"
                  >
                    Create from Playlist
                  </button>
                </form>
                </div>
              </div>
              
              {/* Close button */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateJourney;
