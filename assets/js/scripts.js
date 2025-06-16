
document.addEventListener('DOMContentLoaded', function () {
    const awardForm = document.getElementById('awardForm');
    const awardEntries = document.getElementById('awardEntries');
    const addAwardBtn = document.getElementById('addAwardBtn');
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const awardCounter = document.getElementById('awardCounter');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    let entryCount = 1;

    // Tab functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Show corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Add event listener to the first remove button
    setupRemoveButton(awardEntries.querySelector('.remove-entry'));

    // Add new award entry with animation
    addAwardBtn.addEventListener('click', function () {
        entryCount++;

        const newEntry = document.createElement('div');
        newEntry.className = 'award-entry bg-white p-5 rounded-xl opacity-0';
        newEntry.style.transform = 'translateY(10px)';
        newEntry.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-500">Vorschlag ${entryCount}</span>
                    <button type="button" class="remove-entry text-gray-400 hover:text-red-500 focus:outline-none transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div class="entry-number hidden">${entryCount}</div>
                </div>
                <textarea class="award-suggestion w-full px-4 py-3 border-0 focus:ring-0 focus:outline-none rounded-lg text-gray-700" 
                    rows="3" placeholder="Beschreibe deinen Award-Vorschlag hier..." required></textarea>
            `;

        awardEntries.appendChild(newEntry);

        // Add event listener to remove button
        setupRemoveButton(newEntry.querySelector('.remove-entry'));

        // Animate entry
        setTimeout(() => {
            newEntry.style.transition = 'all 0.3s ease';
            newEntry.style.opacity = '1';
            newEntry.style.transform = 'translateY(0)';
        }, 10);
    });

    // Setup remove button functionality
    function setupRemoveButton(removeBtn) {
        removeBtn.addEventListener('click', function () {
            const entry = this.closest('.award-entry');

            // Check if this is the last entry
            const allEntries = awardEntries.querySelectorAll('.award-entry');
            if (allEntries.length <= 1) {
                // If it's the last entry, just clear it instead of removing
                const textarea = entry.querySelector('.award-suggestion');
                textarea.value = '';
                return;
            }

            // Animate removal
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(10px)';

            setTimeout(() => {
                // Remove the entry
                awardEntries.removeChild(entry);
                updateEntryNumbers();
            }, 300);
        });
    }

    // Update entry numbers after removal
    function updateEntryNumbers() {
        const entries = awardEntries.querySelectorAll('.award-entry');
        entries.forEach((entry, index) => {
            const number = index + 1;
            entry.querySelector('span').textContent = `Vorschlag ${number}`;
            entry.querySelector('.entry-number').textContent = number;
        });
        entryCount = entries.length;
    }

    // Form submission
    awardForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form
        let isValid = true;
        const suggestions = awardForm.querySelectorAll('.award-suggestion');
        suggestions.forEach(textarea => {
            if (!textarea.value.trim()) {
                const parentEntry = textarea.closest('.award-entry');
                parentEntry.classList.add('border-red-500');
                parentEntry.classList.add('shake');
                setTimeout(() => {
                    parentEntry.classList.remove('shake');
                }, 600);
                isValid = false;
            } else {
                const parentEntry = textarea.closest('.award-entry');
                parentEntry.classList.remove('border-red-500');
            }
        });

        if (isValid) {
            // Collect all award suggestions
            const awards = [];
            suggestions.forEach(textarea => {
                awards.push(textarea.value.trim());
            });

            // Update success message
            successMessage.textContent = `${awards.length} Award-Vorschlag${awards.length !== 1 ? 'e' : ''} erfolgreich eingereicht!`;

            // Show success modal with animation
            successModal.classList.remove('hidden');
            setTimeout(() => {
                successModal.classList.add('modal-show');
            }, 10);

            // In a real application, you would send the data to a server here
            console.log('Award suggestions submitted:', awards);
        }
    });

    // Close modal with animation
    closeModalBtn.addEventListener('click', function () {
        successModal.classList.remove('modal-show');
        setTimeout(() => {
            successModal.classList.add('hidden');

            // Reset form
            awardForm.reset();

            // Remove all entries except the first one with animation
            const entries = awardEntries.querySelectorAll('.award-entry');
            for (let i = 1; i < entries.length; i++) {
                const entry = entries[i];
                entry.style.opacity = '0';
                entry.style.transform = 'translateY(10px)';
            }

            setTimeout(() => {
                // Remove entries
                for (let i = 1; i < entries.length; i++) {
                    if (entries[i].parentNode === awardEntries) {
                        awardEntries.removeChild(entries[i]);
                    }
                }

                // Reset entry count
                entryCount = 1;

                // Clear any validation styling
                const firstEntry = awardEntries.querySelector('.award-entry');
                firstEntry.classList.remove('border-red-500');
            }, 300);
        }, 300);
    });

    // Add shake animation for validation
    const style = document.createElement('style');
    style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .shake {
                animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
            }
        `;
    document.head.appendChild(style);
});

(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'94ec41e112b6e67c',t:'MTc0OTc2MTgxMi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();
