// Author: Phoebe Franklin 2/23/2026
function Portal() {
 return (
    <div>
        <h1>Projects</h1>
        <ul>
        <li>Project 1</li>
        <li>Project 2</li>
        <li>Project 3</li>
        </ul>

        <h1>Create New Project</h1>
                <h2>Project Name:</h2>
      <input 
        type="text"
        placeholder="Name"
      />
              <h2>ProjectID:</h2>
      <input 
        type="text"
        placeholder="ProjectID"
      />
              <h2>Project Description:</h2>
      <input 
        type="text"
        placeholder="Description"
        size = "50"
      />

    </div>

  );
}


export default Portal;