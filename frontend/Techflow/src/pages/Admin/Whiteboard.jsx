import React, { useContext, useEffect, useState } from "react"
import AppLayout from "../../components/layouts/AppLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import moment from "moment";
import SelectCoverageUser from "../../components/Inputs/SelectCoverageUser";
import SelectProvider from "../../components/Inputs/SelectProvider";
import { getInitials } from "../../utils/getInitials";
import toast from "react-hot-toast";
import AddCommentsInput from "../../components/Inputs/AddCommentsInput";
import AddBirthdaysInput from "../../components/Inputs/AddBirthdaysInput";
import AddAnniversariesInput from "../../components/Inputs/AddAnniversariesInput";
import Modal from "../../components/Modal";
import { CiSaveDown1 } from "react-icons/ci";
import { LuEraser } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GiBalloons } from "react-icons/gi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoStarSharp } from "react-icons/io5";
import AvatarTooltip from "../../components/AvatarTooltip";

const Whiteboard = () => {
  const { user } = useContext(UserContext);
  const [whiteboardData, setWhiteboardData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show8AMValidationModal, setShow8AMValidationModal] = useState(false);
  const [showRoutineConflictModal, setShowRoutineConflictModal] = useState(false);

  const [editData, setEditData] = useState({
    coverage: {
      onCall: [],
      surgCall: [],
      scanning: [],
      surgicals: [],
      wada: [],
    },
    outpatients: {
      np8am: [],
      op8am1: [],
      op8am2: [],
      op10am: [],
      op12pm: [],
      op2pm: [],
    },
    readingProviders: {
      emu: null,
      ltm: null,
      routine: null,
      routineAM: null,
      routinePM: null,      
    },
    comments: [],
    birthdays: [],
    anniversaries: [],    
  });

  const getWhiteboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.WHITEBOARD.GET_WHITEBOARD);
      setWhiteboardData(response.data);
      
      setEditData({
        coverage: {
          onCall: response.data?.coverage?.onCall?.map(user => user._id) || [],
          surgCall: response.data?.coverage?.surgCall?.map(user => user._id) || [],
          scanning: response.data?.coverage?.scanning?.map(user => user._id) || [],
          surgicals: response.data?.coverage?.surgicals?.map(user => user._id) || [],
          wada: response.data?.coverage?.wada?.map(user => user._id) || [],
        },
        outpatients: {
          np8am: response.data?.outpatients?.np8am?.map(user => user._id) || [],
          op8am1: response.data?.outpatients?.op8am1?.map(user => user._id) || [],
          op8am2: response.data?.outpatients?.op8am2?.map(user => user._id) || [],
          op10am: response.data?.outpatients?.op10am?.map(user => user._id) || [],
          op12pm: response.data?.outpatients?.op12pm?.map(user => user._id) || [],
          op2pm: response.data?.outpatients?.op2pm?.map(user => user._id) || [],
        },
        readingProviders: {
          emu: response.data?.readingProviders?.emu?._id || null,
          ltm: response.data?.readingProviders?.ltm?._id || null,
          routine: response.data?.readingProviders?.routine?._id || null,
          routineAM: response.data?.readingProviders?.routineAM?._id || null,
          routinePM: response.data?.readingProviders?.routinePM?._id || null,          
        },
        comments: response.data?.comments || [],
        birthdays: response.data?.birthdays || [],
        anniversaries: response.data?.anniversaries || [],        
      });
    } catch (error) {
      console.error("Error fetching whiteboard data:", error);
    }
  };

  const preloadUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      // This just primes the cache in SelectCoverageUser
    } catch (error) {
      console.error("Error preloading users:", error);
    }
  };

  const handle8AMSelection = (slot, userIds) => {
    setEditData(prev => {
      const updated = { ...prev.outpatients, [slot]: userIds };
      const assignedCount = ['np8am', 'op8am1', 'op8am2'].filter(
        key => (updated[key]?.length > 0)
      ).length;
      if (assignedCount > 2) {
        setShow8AMValidationModal(true);
        return prev; // reject the change
      }
      return { ...prev, outpatients: updated };
    });
  };

  const handleRoutineSelection = (slot, providerId) => {
    setEditData(prev => {
      const rp = prev.readingProviders;
      if (slot === 'routine' && providerId) {
        if (rp.routineAM || rp.routinePM) {
          setShowRoutineConflictModal(true);
          return prev;
        }
      }
      if ((slot === 'routineAM' || slot === 'routinePM') && providerId) {
        if (rp.routine) {
          setShowRoutineConflictModal(true);
          return prev;
        }
      }
      return { ...prev, readingProviders: { ...rp, [slot]: providerId } };
    });
  };

  const handleSaveChanges = async () => {    
    setLoading(true);
    try {
      const updatePayload = {
        coverage: editData.coverage,
        outpatients: editData.outpatients,
        readingProviders: editData.readingProviders,
        comments: editData.comments,
        birthdays: editData.birthdays,
        anniversaries: editData.anniversaries,
      };

      await axiosInstance.put(API_PATHS.WHITEBOARD.UPDATE_WHITEBOARD, updatePayload);
      
      toast.success("Whiteboard updated successfully");
      setIsEditMode(false);
      getWhiteboardData();
    } catch (error) {
      console.error("Error updating whiteboard:", error);
      toast.error("Failed to update whiteboard");
    } finally {
      setLoading(false);
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      handleSaveChanges();
    } else {
      setIsEditMode(true);
    }
  };

  const handleClearReadingProviders = () => {
    setEditData(prev => ({
      ...prev,
      readingProviders: {
        emu: null,
        ltm: null,
        routine: null,
        routineAM: null,
        routinePM: null,        
      }
    }));
  };

  const handleClearOutpatients = () => {
    setEditData(prev => ({
      ...prev,
      outpatients: {
        np8am: [],
        op8am1: [],
        op8am2: [],
        op10am: [],
        op12pm: [],
        op2pm: [],
      }
    }));
  };

  const handleClearCoverage = () => {
    setEditData(prev => ({
      ...prev,
      coverage: {
        onCall: [],
        surgCall: [],
        scanning: [],
        surgicals: [],
        wada: [],
      }
    }));
  };

  const renderUserDisplay = (userDataArray) => {
    if (!userDataArray || userDataArray.length === 0) return <span className="text-gray-400">—</span>;
    
    // Sort alphabetically by name
    const sortedUsers = [...userDataArray].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    return (
      <div className="flex items-center gap-1 flex-wrap justify-end">
        {sortedUsers.map((userData, index) => (
          <AvatarTooltip key={userData._id || index} name={userData.name}>
            <div className="flex items-center">
              {userData.profileImageUrl ? (
                <img
                  src={userData.profileImageUrl}
                  alt={userData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: userData.profileColor || "#30b5b2" }}
                >
                  {getInitials(userData.name)}
                </div>
              )}
            </div>
          </AvatarTooltip>
        ))}
      </div>
    );
  };

  const renderRoutineDisplay = () => {
    const { routine, routineAM, routinePM } = whiteboardData?.readingProviders || {};

    if (!routine && !routineAM && !routinePM) {
      return <span className="text-gray-400">—</span>;
    }

    if (routine) {
      return renderProviderDisplay(routine);
    }

    if (routineAM && routinePM) {
      return (
        <div className="grid gap-x-2 gap-y-1" style={{ gridTemplateColumns: 'auto 1fr' }}>
          <span className="text-gray-400 text-xs self-center">AM |</span>
          <div className="flex justify-end">{renderProviderDisplay(routineAM)}</div>
          <span className="text-gray-400 text-xs self-center">PM |</span>
          <div className="flex justify-end">{renderProviderDisplay(routinePM)}</div>
        </div>
      );
    }

    if (routineAM) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">AM |</span>
          {renderProviderDisplay(routineAM)}
        </div>
      );
    }

    if (routinePM) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">PM |</span>
          {renderProviderDisplay(routinePM)}
        </div>
      );
    }
  };
  
  const renderProviderDisplay = (providerData) => {
    if (!providerData) return <span className="text-gray-400">—</span>;
    
    const lastName = providerData.name.split(' ').pop();
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Dr. {lastName}</span>
        <AvatarTooltip name={providerData.name}>
          <div 
            className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium"
            style={{ backgroundColor: providerData.profileColor || "#30b5b2" }}
          >
            {getInitials(providerData.name)}
          </div>
        </AvatarTooltip>
      </div>
    );
  };

  useEffect(() => {
    getWhiteboardData();
    preloadUsers();
  }, []);

  return (
    <AppLayout activeMenu="Whiteboard">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4 mb-2">
          <div className="form-card col-span-3">
            <div className="flex md:flex-row justify-between mb-0.5">
              <div>
                <h2 className="text-xl md:text-xl text-gray-600 font-bold">Whiteboard</h2>

                <h1 className="text-base md:text-lg text-gray-400">{user?.departmentId?.departmentName || 'Department'}</h1>
              </div>
              
              <div>
                <button 
                  className="edit-btn flex items-center gap-2"
                  onClick={handleEditModeToggle}
                  disabled={loading}
                >
                  {isEditMode ? (
                    loading ? (
                      <>
                        <CiSaveDown1 />
                      </>
                    ) : (
                      <>
                        <IoMdCheckmarkCircleOutline />
                      </>
                    )
                  ) : (
                    <>
                      <LiaEdit />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                {moment().format("dddd Do MMMM YYYY")}
              </p>
              <p className="text-xs font-medium text-gray-400">Whiteboard Last Updated</p>
              <p className="text-xs text-gray-400">
                {whiteboardData?.updatedAt ? (
                  <>
                    {moment(whiteboardData.updatedAt).format("dddd Do MMM YYYY [at] h:mm A")}
                    {whiteboardData?.lastUpdatedBy && (
                      <>
                        <span className="hidden md:inline"> by {whiteboardData.lastUpdatedBy.name}</span>
                        <span className="block md:hidden">by {whiteboardData.lastUpdatedBy.name}</span>
                      </>
                    )}
                  </>
                ) : (
                  "Not Updated"
                )}
              </p>
            </div>
          </div>
        </div>
                  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 mt-2">
          {/* Reading Providers Section */}
          <div className="form-card col-span-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base md:text-lg font-medium text-gray-600">Reading Providers</h2>
              {isEditMode && (
                <button
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
                  onClick={handleClearReadingProviders}
                >
                  Clear
                  <LuEraser className="text-xs"/>
                </button>
              )}
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex justify-between items-center">
                <p>EMU</p>
                {isEditMode ? (
                  <div className="w-32">
                    <SelectProvider
                      selectedProviderId={editData.readingProviders.emu}
                      onProviderSelect={(providerId) => setEditData(prev => ({
                        ...prev,
                        readingProviders: { ...prev.readingProviders, emu: providerId }
                      }))}
                      placeholder="Select"
                    />
                  </div>
                ) : (
                  renderProviderDisplay(whiteboardData?.readingProviders?.emu)
                )}
              </div>

              <div className="flex justify-between items-center">
                <p>LTM</p>
                {isEditMode ? (
                  <div className="w-32">
                    <SelectProvider
                      selectedProviderId={editData.readingProviders.ltm}
                      onProviderSelect={(providerId) => setEditData(prev => ({
                        ...prev,
                        readingProviders: { ...prev.readingProviders, ltm: providerId }
                      }))}
                      placeholder="Select"
                    />
                  </div>
                ) : (
                  renderProviderDisplay(whiteboardData?.readingProviders?.ltm)
                )}
              </div>

              {isEditMode ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p>ROUTINE | All Day</p>
                    <div className="w-32">
                      <SelectProvider
                        selectedProviderId={editData.readingProviders.routine}
                        onProviderSelect={(providerId) => handleRoutineSelection('routine', providerId)}
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>ROUTINE | AM</p>
                    <div className="w-32">
                      <SelectProvider
                        selectedProviderId={editData.readingProviders.routineAM}
                        onProviderSelect={(providerId) => handleRoutineSelection('routineAM', providerId)}
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>ROUTINE | PM</p>
                    <div className="w-32">
                      <SelectProvider
                        selectedProviderId={editData.readingProviders.routinePM}
                        onProviderSelect={(providerId) => handleRoutineSelection('routinePM', providerId)}
                        placeholder="Select"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="pt-1.5">ROUTINE</p>
                  {renderRoutineDisplay()}
                </div>
              )}              
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 gap-2 mb-2 mt-2">
          {/* Outpatients Section */}
          <div className="form-card col-span-1 md:col-span-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base md:text-lg font-medium text-gray-600">Outpatients</h2>
              {isEditMode && (
                <button
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
                  onClick={handleClearOutpatients}
                >
                  Clear
                  <LuEraser className="text-xs"/>
                </button>                      
              )}
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              {/* In Edit Mode: Show all three 8am slots */}
              {isEditMode && (
                <>
                  {/* NP 8am - Always visible in edit mode */}
                  <div className="flex justify-between items-center">
                    <p className="whitespace-nowrap">8 AM | NP</p>
                    <div className="w-32">
                      <SelectCoverageUser
                        selectedUsers={editData.outpatients.np8am}
                        setSelectedUsers={(userIds) => handle8AMSelection('np8am', userIds)}
                      />
                    </div>
                  </div>

                  {/* First 8am */}
                  <div className="flex justify-between items-center">
                    <p className="whitespace-nowrap">8 AM</p>
                    <div className="w-32">
                      <SelectCoverageUser
                        selectedUsers={editData.outpatients.op8am1}
                        setSelectedUsers={(userIds) => handle8AMSelection('op8am1', userIds)}
                      />
                    </div>
                  </div>

                  {/* Second 8am */}
                  <div className="flex justify-between items-center">
                    <p className="whitespace-nowrap">8 AM</p>
                    <div className="w-32">
                      <SelectCoverageUser
                        selectedUsers={editData.outpatients.op8am2}
                        setSelectedUsers={(userIds) => handle8AMSelection('op8am2', userIds)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* In View Mode: Show only assigned slots, NP first if assigned */}
              {!isEditMode && (
                <>
                  {/* NP 8am - Show first if assigned */}
                  {whiteboardData?.outpatients?.np8am?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">8 AM | NP</p>
                      {renderUserDisplay(whiteboardData?.outpatients?.np8am)}
                    </div>
                  )}

                  {/* First 8am - Show if assigned */}
                  {whiteboardData?.outpatients?.op8am1?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">8 AM</p>
                      {renderUserDisplay(whiteboardData?.outpatients?.op8am1)}
                    </div>
                  )}

                  {/* Second 8am - Show if assigned */}
                  {whiteboardData?.outpatients?.op8am2?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">8 AM</p>
                      {renderUserDisplay(whiteboardData?.outpatients?.op8am2)}
                    </div>
                  )}
                </>
              )}

              {/* Rest of the slots - visible in both modes if assigned in view mode */}
              {(isEditMode || whiteboardData?.outpatients?.op10am?.length > 0) && (
                <div className="flex justify-between items-center">
                  <p className="whitespace-nowrap">10 AM</p>
                  {isEditMode ? (
                    <div className="w-32">
                      <SelectCoverageUser
                        selectedUsers={editData.outpatients.op10am}
                        setSelectedUsers={(userIds) => {
                          setEditData(prev => ({
                            ...prev,
                            outpatients: { ...prev.outpatients, op10am: userIds }
                          }));
                        }}
                      />
                    </div>
                  ) : (
                    renderUserDisplay(whiteboardData?.outpatients?.op10am)
                  )}
                </div>
              )}

              {(isEditMode || whiteboardData?.outpatients?.op12pm?.length > 0) && (
                <div className="flex justify-between items-center">
                  <p className="whitespace-nowrap">12 PM</p>
                  {isEditMode ? (
                    <div className="w-32">
                      <SelectCoverageUser
                        selectedUsers={editData.outpatients.op12pm}
                        setSelectedUsers={(userIds) => {
                          setEditData(prev => ({
                            ...prev,
                            outpatients: { ...prev.outpatients, op12pm: userIds }
                          }));
                        }}
                      />
                    </div>
                  ) : (
                    renderUserDisplay(whiteboardData?.outpatients?.op12pm)
                  )}
                </div>
              )}

              {(isEditMode || whiteboardData?.outpatients?.op2pm?.length > 0) && (
                <div className="flex justify-between items-center">
                  <p className="whitespace-nowrap">2 PM</p>
                  {isEditMode ? (
                    <div className="w-32">
                      <SelectCoverageUser
                        selectedUsers={editData.outpatients.op2pm}
                        setSelectedUsers={(userIds) => {
                          setEditData(prev => ({
                            ...prev,
                            outpatients: { ...prev.outpatients, op2pm: userIds }
                          }));
                        }}
                      />
                    </div>
                  ) : (
                    renderUserDisplay(whiteboardData?.outpatients?.op2pm)
                  )}
                </div>
              )}

              {/* Show message if no outpatient slots assigned */}
              {!isEditMode && 
                ![
                  whiteboardData?.outpatients?.np8am,
                  whiteboardData?.outpatients?.op8am1,
                  whiteboardData?.outpatients?.op8am2,
                  whiteboardData?.outpatients?.op10am,
                  whiteboardData?.outpatients?.op12pm,
                  whiteboardData?.outpatients?.op2pm
                ].some(slot => slot && slot.length > 0) && (
                  <p className="text-sm text-gray-400 mt-2">No outpatients scheduled for today</p>
              )}
            </div>
          </div>

          {/* Coverage Section */}
          <div className="form-card col-span-1 md:col-span-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base md:text-lg font-medium text-gray-600">Coverage</h2>
              {isEditMode && (
                <button
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
                  onClick={handleClearCoverage}
                >
                  Clear
                  <LuEraser className="text-xs"/>
                </button>
              )}
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              {[
                { label: "ON CALL", key: "onCall" },
                { label: "SURG CALL", key: "surgCall" },
                { label: "SCANNING", key: "scanning" },
                { label: "SURGICAL", key: "surgicals" },
                { label: "WADA", key: "wada" },
              ].map(({ label, key }) => {
                const hasUsers = whiteboardData?.coverage?.[key]?.length > 0;

                if (!isEditMode && !hasUsers) return null;

                return (
                  <div className="flex justify-between items-center" key={key}>
                    <p className="whitespace-nowrap">{label}</p>
                    {isEditMode ? (
                      <div className="w-32">
                        <SelectCoverageUser
                          selectedUsers={editData.coverage[key]}
                          setSelectedUsers={(userIds) =>
                            setEditData((prev) => ({
                              ...prev,
                              coverage: { ...prev.coverage, [key]: userIds },
                            }))
                          }
                        />
                      </div>
                    ) : (
                      renderUserDisplay(whiteboardData?.coverage?.[key])
                    )}
                  </div>
                );
              })}
              {!isEditMode && 
                !["onCall", "surgCall", "scanning", "surgicals", "wada"].some(
                  key => whiteboardData?.coverage?.[key]?.length > 0
                ) && (
                  <p className="text-sm text-gray-400 mt-2">Add technologist coverage for the day</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 mt-2">
          {/* Comments Section */}
          <div className="form-card col-span-3">
            <h2 className="text-base md:text-lg mb-2 font-medium text-gray-600">Comments</h2>
            {!isEditMode ? (
              <>
                {whiteboardData?.comments?.length > 0 ? (
                  <div className="mt-4">
                    {whiteboardData.comments.map((comment, index) => (
                      <Comment key={`comment_${index}`} comment={comment} index={index} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No comments for today</p>
                )}
              </>
            ) : (
              <AddCommentsInput
                comments={editData.comments}
                setComments={(newComments) =>
                  setEditData((prev) => ({ ...prev, comments: newComments }))
                }
              />
            )}
          </div>
        </div>

        {(isEditMode || (whiteboardData?.birthdays?.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 mt-2">
            <div className="form-card col-span-3">
              <h2 className="flex items-start gap-2 text-base md:text-lg mb-2 font-medium text-gray-600">
                <GiBalloons className="text-base md:text-lg font-medium text-rose-400 flex-shrink-0 mt-1" />
                Birthdays
                <GiBalloons className="text-base md:text-lg font-medium text-blue-400 flex-shrink-0 mt-1" />
              </h2>
              {!isEditMode ? (
                <div className="mt-1">
                  {whiteboardData.birthdays.map((entry, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2 font-medium">
                      <LiaBirthdayCakeSolid className="text-lg text-orange-400 flex-shrink-0" />
                      <p className="text-sm md:base text-gray-600 flex-1">{entry}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <AddBirthdaysInput
                  birthdays={editData.birthdays}
                  setBirthdays={(newBirthdays) =>
                    setEditData((prev) => ({ ...prev, birthdays: newBirthdays }))
                  }
                />
              )}
            </div>
          </div>
        )}

        {(isEditMode || (whiteboardData?.anniversaries?.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 mt-2">
            <div className="form-card col-span-3">
              <h2 className="flex items-start gap-2 text-base md:text-lg mb-2 font-medium text-gray-600">
                <IoStarSharp className="text-base md:text-lg font-medium text-amber-400 flex-shrink-0 mt-1" />
                Anniversaries
                <IoStarSharp className="text-base md:text-lg font-medium text-amber-400 flex-shrink-0 mt-1" />
              </h2>
              {!isEditMode ? (
                <div className="mt-1">
                  {whiteboardData.anniversaries.map((entry, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2 font-medium">
                      <BsEmojiSmile className="text-lg text-amber-400 flex-shrink-0 mt-0.25" />
                      <p className="text-sm md:base text-gray-600 flex-1">{entry}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <AddAnniversariesInput
                  anniversaries={editData.anniversaries}
                  setAnniversaries={(newAnniversaries) =>
                    setEditData((prev) => ({ ...prev, anniversaries: newAnniversaries }))
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={show8AMValidationModal}
        onClose={() => setShow8AMValidationModal(false)}
        title="8 AM Slot Limit Reached"
      >
        <div>
          <p className="text-sm dark:text-white mb-4">
            Cannot select more than two 8 AM slots. Please clear users from one of the 8 AM slots first.
          </p>
          <div className="flex justify-end">
            <button
              className="card-btn"
              onClick={() => setShow8AMValidationModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRoutineConflictModal}
        onClose={() => setShowRoutineConflictModal(false)}
        title="Routine Slot Conflict"
      >
        <div>
          <p className="text-sm dark:text-white mb-4">
            Cannot select All Day when AM or PM is already assigned, and vice versa. Please clear the conflicting slot first.
          </p>
          <div className="flex justify-end">
            <button
              className="card-btn"
              onClick={() => setShowRoutineConflictModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default Whiteboard;

const Comment = ({ comment, index }) => {
  return <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
    <div className="flex items-start gap-3">
      <p className="text-xs text-black flex-1">{comment}</p>
    </div>
  </div>
}