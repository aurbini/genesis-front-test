let houseHoldMembers = [];
let memberID = 0;
let houseHold = {};
const addButton = document.querySelector('.add');
const builder = document.querySelector('.builder');
const houseHoldContainer = document.createElement('div');
const pre = document.querySelector('.debug');

document.querySelector('form').addEventListener('submit', function (e) {
  const age = document.querySelector('#age').value;
  const smoker = document.querySelector('#smoker').checked;
  const relationship = document.querySelector('#rel').value;
  e.preventDefault();

  if (e.submitter.classList == 'add') {
    onAddMember(age, smoker, relationship);
  } else {
    onSubmitForm();
  }
});

function onAddMember(age, smoker, relationship) {
  if (!checkIfFormIsValid(age, relationship)) {
    return false;
  }
  const houseHoldMember = {
    age: age,
    relationship: relationship,
    smoker: smoker,
    id: ++memberID,
  };
  houseHoldMembers.push(houseHoldMember);
  renderHouseHoldMembers();
  document.querySelector('form').reset();
}

function onDeleteMember(id) {
  houseHoldMembers = houseHoldMembers.filter((member) => {
    return member.id != id;
  });
  renderHouseHoldMembers();
}

function renderHouseHoldMembers() {
  houseHoldContainer.innerHTML = '';

  for (let i = 0; i < houseHoldMembers.length; i++) {
    const currentMember = houseHoldMembers[i];
    const member = document.createElement('div');
    var memberTitle = document.createElement('h3');
    var memberAge = document.createElement('p');
    var memberRel = document.createElement('p');
    var memberSmoking = document.createElement('p');

    memberTitle.innerHTML = 'Member ' + (i + 1);
    memberAge.innerHTML = 'Age: ' + currentMember.age;
    memberRel.innerHTML = 'Relationship: ' + currentMember.relationship;
    memberSmoking.innerHTML = 'Smoker: ' + currentMember.smoker;

    var deleteMember = document.createElement('button');
    deleteMember.type = 'button';
    deleteMember.innerHTML = 'DELETE';
    deleteMember.classList.add('delete-button');
    deleteMember.setAttribute('id', `member-${member.id}`);
    deleteMember.addEventListener('click', () =>
      onDeleteMember(houseHoldMembers[i].id)
    );

    member.appendChild(memberTitle);
    member.appendChild(memberAge);
    member.appendChild(memberRel);
    member.appendChild(memberSmoking);
    member.appendChild(deleteMember);

    houseHoldContainer.appendChild(member);
  }
  builder.appendChild(houseHoldContainer);
}

function onSubmitForm() {
  houseHoldContainer.innerHTML = '';
  pre.innerHTML = '';
  const houseHoldJSON = JSON.stringify(houseHoldMembers);
  const houseHoldDisplay = document.createElement('p');
  var editHouseHold = document.createElement('button');
  editHouseHold.type = 'button';
  editHouseHold.setAttribute('id', `edit-button`);
  editHouseHold.innerHTML = 'EDIT';
  editHouseHold.addEventListener('click', () => onOpenEditMode());
  houseHoldDisplay.innerText = houseHoldJSON;
  pre.appendChild(houseHoldDisplay);
  pre.appendChild(editHouseHold);
  pre.style.display = 'block';
  pre.style.overflow = 'auto';
}

function onOpenEditMode() {
  const editButton = document.getElementById('edit-button');
  editButton.remove();

  const editMemberForm = document.createElement('form');
  editMemberForm.setAttribute('id', 'resubmit-form');
  for (let i = 0; i < houseHoldMembers.length; i++) {
    const member = houseHoldMembers[i];
    const editMemberContainer = document.createElement('div');
    const memberEditAgeInput = document.createElement('input');
    const memberEditSmokerCheckbox = document.createElement('input');
    const ageLabel = document.createElement('label');
    const relationshipLabel = document.createElement('label');

    const smokerLabel = document.createElement('label');
    const memberEditRelationshipSelect = createEditModeSelect(
      member.relationship
    );

    smokerLabel.innerHTML = 'Smoker';
    ageLabel.innerHTML = 'Age';
    relationshipLabel.innerHTML = 'Relationship';
    memberEditSmokerCheckbox.type = 'checkbox';
    memberEditSmokerCheckbox.name = 'Smoker';
    memberEditSmokerCheckbox.checked = member.smoker;
    memberEditAgeInput.value = member.age;

    memberEditSmokerCheckbox.setAttribute('id', `edit-smoker-${member.id}`);
    memberEditAgeInput.setAttribute('id', `edit-age-${member.id}`);
    memberEditRelationshipSelect.setAttribute(
      'id',
      `edit-relationship-${member.id}`
    );

    smokerLabel.appendChild(memberEditSmokerCheckbox);
    ageLabel.appendChild(memberEditAgeInput);
    relationshipLabel.appendChild(memberEditRelationshipSelect);
    editMemberContainer.appendChild(ageLabel);
    editMemberContainer.appendChild(relationshipLabel);
    editMemberContainer.appendChild(smokerLabel);

    editMemberForm.appendChild(editMemberContainer);
  }
  var resubmitHousehold = document.createElement('button');
  resubmitHousehold.type = 'submit';
  resubmitHousehold.innerHTML = 'RESUBMIT';
  editMemberForm.appendChild(resubmitHousehold);

  editMemberForm.addEventListener('submit', (e) => onResubmit(e));
  var cancelEdit = document.createElement('button');
  cancelEdit.type = 'button';
  cancelEdit.innerHTML = 'CANCEL EDIT';
  cancelEdit.addEventListener('click', () => {
    editMemberForm.innerHTML = '';
    cancelEdit.remove();
    var editHouseHold = document.createElement('button');
    editHouseHold.type = 'button';
    editHouseHold.setAttribute('id', `edit-button`);
    editHouseHold.innerHTML = 'EDIT';
    editHouseHold.addEventListener('click', () => onOpenEditMode());
    pre.appendChild(editHouseHold);
  });

  pre.appendChild(editMemberForm);
  pre.appendChild(cancelEdit);
}

function onResubmit(e) {
  e.preventDefault();
  const elements = document.getElementById('resubmit-form').elements;
  houseHoldMembers.forEach((element, index) => {
    const memberAge = document.getElementById(`edit-age-${index + 1}`).value;
    const memberRel = document.getElementById(
      `edit-relationship-${index + 1}`
    ).value;
    const memberSmoker = document.getElementById(
      `edit-smoker-${index + 1}`
    ).checked;

    if (!checkIfFormIsValid(memberAge, memberRel)) {
      return false;
    }
    houseHoldMembers[index] = {
      age: memberAge,
      relationhip: memberRel,
      smoker: memberSmoker,
      id: element.id,
    };
  });
  onSubmitForm();
}

function checkIfFormIsValid(age, relationship) {
  if (isNaN(age) || age < 1) {
    return false;
  }
  if (relationship == '') {
    return false;
  }
  return true;
}

function createEditModeSelect(relationship) {
  const options = [
    { display: 'Self', value: 'self' },
    { display: 'Spouse', value: 'spouse' },
    { display: 'Child', value: 'child' },
    { display: 'Parent', value: 'parent' },
    { display: 'Grandparent', value: 'grandparent' },
  ];
  const relationshipSelect = document.createElement('select');
  let selectedIndex = '';
  for (let i = 0; i < options.length; i++) {
    const element = options[i];
    if (element.value == relationship) selectedIndex = i;
    relationshipSelect.add(new Option(element.display, element.value));
  }
  relationshipSelect.selectedIndex = selectedIndex;
  return relationshipSelect;
}
