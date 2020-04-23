<?php


    $sNickname = isset($_POST['sNickname']) ? $_POST['sNickname'] : null;
    $sScore = isset($_POST['sScore']) ? $_POST['sScore'] : null;
    $sGeo = isset($_POST['sGeo']) ? $_POST['sGeo'] : "Unknown";

    if($sNickname != null && $sScore != null){

        $conn = new mysqli("localhost", "id6059922_panken", "zombie2018", "id6059922_zombie");

        if (!$conn->connect_error) {

			$dateText = date("d/m/Y");
            $insertScore = "INSERT INTO soloScores (sNickname, sScore, sGeo, sDate)
            VALUES ( '".$sNickname."', '".$sScore."', '".$sGeo."', '".$dateText."')";

            if ($conn->query($insertScore) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $insertScore . "<br>" . $conn->error;
            }
        }
		else
			die("Connection failed: " . $conn->connect_error);
    }


?>