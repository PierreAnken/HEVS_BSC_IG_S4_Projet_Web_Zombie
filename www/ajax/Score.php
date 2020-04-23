<h1>Leaderboard</h1>
<div>
    <table  class = "scores">
        <tr>
            <th>N°</th>
            <th>Pseudo</th>
            <th>Points</th>
            <th notOnMobile>Date</th>
            <th notOnMobile>Pays</th>
        </tr>

		<?php

		$conn = new mysqli("localhost", "id6059922_panken", "zombie2018", "id6059922_zombie");

        if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$getTopScore = "Select * FROM soloScores ORDER BY sScore DESC LIMIT 0,8";
		$result = $conn->query($getTopScore);

		$i = 1;
		while($row = $result->fetch_assoc())
		{
		   echo "<tr>
				<td>".$i."</td>
				<td>".$row['sNickname']."</td>
				<td>".$row['sScore']."</td>
				<td notOnMobile>".$row['sDate']."</td>
				<td notOnMobile>".$row['sGeo']."</td>
			</tr>";
			$i++;
		}


		?>

    </table>

<br>
<button link="Home">Back</button>
</div>