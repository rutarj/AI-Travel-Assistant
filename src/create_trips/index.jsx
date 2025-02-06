import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, budgetOptions, tripDestinations } from "@/constants/options.jsx";
import { chatSession } from "@/service/AiModel";
import { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import DialogBtn from "./Dialog";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Header from "@/components/custom/Header";


const CreateTrip = () => {
  const [place, setPlace] = useState()
  const [formdata, setFormdata] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleInputChange = (name, value) => {
    setFormdata({
      ...formdata,
      [name]: value
    })
  }


  
  const onGenerateTrip = async () => {
  // Ensure user is logged in
  const user = localStorage.getItem("user");
  if (!user) {
    setOpenDialog(true);
    return;
  }

  // Validate that all required fields are filled and within range
  if (formdata?.Days <= 0 || formdata?.Days > 9 || !formdata?.location || !formdata?.Budget || !formdata?.People) {
    toast("Please fill in all fields and ensure the days are between 1 and 9.");
    return;
  }

  setLoading(true); // Start loading state

  // Replace placeholders in the AI_PROMPT with actual data from the form
  const FINAL_PROMPT = AI_PROMPT
    .replace("{location}", formdata?.location?.label)    // Location
    .replace("{totalDays}", formdata?.Days)              // Days
    .replace("{People}", formdata?.Budget)               // Budget (assuming it's mapped to "People")
    .replace("{totalDays}", formdata?.Days);             // Another totalDays replacement (it's repeated)

  console.log("Final Prompt:", FINAL_PROMPT);  // Log the generated prompt for debugging

  try {
    // Send the generated prompt to chatSession for AI response
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("AI Response:", result?.response?.text());  // Log the response to check format

    // Save the AI-generated trip and stop the loading state
    setLoading(false);
    saveAiTrip(result?.response?.text());
  } catch (error) {
    // Handle errors in API request or response
    setLoading(false);
    console.error("Error generating trip:", error);
    toast("There was an error generating the trip. Please try again.");
  }
};


  const saveAiTrip = async (TripData) => {

    setLoading(true)
    const user = JSON.parse(localStorage.getItem('user'))
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formdata,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId

    });

    setLoading(false)
    navigate("/view-trip/" + docId)
  }

  const getUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((res) => {
      console.log(res);
      localStorage.setItem('user', JSON.stringify(res.data))
      setOpenDialog(false)
      onGenerateTrip()

    })
  }

  const login = useGoogleLogin({
    onSuccess: (coreRes) => getUserProfile(coreRes),
    onError: (error) => console.log(error)
  })



  useEffect(() => {
    console.log("The form Data", formdata);
  }, [formdata])


  return (
    <>
    <Header />
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 mb-5">
        <h2 className="font-semibold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
        <p className="text-gray-500">Let us know your travel preferences so we can tailor the perfect itinerary for your next adventure.</p>

        <div className="mt-10 flex flex-col gap-5">
          <div>
            <h2 className="text-xl my-3 font-medium">What is Your Destination?</h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API}
              selectProps={{
                place,
                onChange: (e) => { setPlace(e); handleInputChange("location", e) },
              }}
            />
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">How many days are you planning for your Trip?</h2>
            <Input placeholder={"Ex.3"} type="number" onChange={(e) => handleInputChange("Days", e.target.value)} />
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {budgetOptions.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange("Budget", item.title)}
                  className={`border px-3 py-2 rounded-lg hover:shadow-lg cursor-pointer ${formdata?.Budget == item.title && "border-black shadow-lg"}`}>
                  <h2 className="text-3xl text-center">{item.icon}</h2>
                  <h2 className="font-bold text-lg text-center">{item.title}</h2>
                  <h2 className="line-clamp-2 text-gray-500 text-center">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">Who do you plan on travelling with on your next Adventure?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {tripDestinations.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange("People", item.people)}
                  className={`border px-3 py-2 rounded-lg hover:shadow-lg cursor-pointer ${formdata?.People == item.people && "border-black shadow-lg"}`}>
                  <h2 className="text-3xl py-2 text-center">{item.icon}</h2>
                  <h2 className="font-bold text-lg text-center">{item.title}</h2>
                  <h2 className="line-clamp-2 text-gray-500 text-center">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

        </div>
        <div className="mt-5 flex justify-end">
          {/* <Link to={'/view-trip/docId'}>
        </Link> */}
          <Button
            disabled={loading}
            onClick={onGenerateTrip}>{loading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Generate Text"}
          </Button>
        </div>

        <DialogBtn open={openDialog} login={login} />

      </div>
    </>
  );
};

export default CreateTrip;