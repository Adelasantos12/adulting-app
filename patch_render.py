with open("public/index.html", "r") as f:
    content = f.read()

# Definimos las funciones de renderizado de las pantallas del Modulo 1 y Modulo 2
render_logic = """
        // --- MOTOR DE VISTAS (RENDER PAGE) ---
        function renderPage(page) {
            const themeColor = state.theme;

            switch (page) {
                case 'dashboard':
                    const randomFrase = "La paciencia contigo mismo es clave durante esta transición.";
                    return `
                        <!-- Tarjeta de bienvenida -->
                        <div class="p-6 bg-gradient-to-r from-theme-${themeColor}-500 to-theme-${themeColor}-600 text-white rounded-3xl shadow-xl relative overflow-hidden">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-white/80 block">Modo Adulto</span>
                            <h3 class="text-xl font-bold mt-2">¿Qué necesitas resolver hoy?</h3>
                            <p class="text-xs text-white/80 mt-1">Sistemas mínimos de supervivencia para cuando estás cansado o abrumado.</p>
                        </div>

                        <!-- Grid de Categorías de Inicio -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <!-- Dinero -->
                            <div onclick="navigate('money')" class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer space-y-3">
                                <span class="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
                                    <i data-lucide="wallet" class="w-5 h-5"></i>
                                </span>
                                <h4 class="font-bold text-sm">💳 Dinero sin Drama</h4>
                                <p class="text-xs text-slate-400">Revisar tarjetas, deudas, seguros o preparar tus obligaciones fiscales.</p>
                            </div>

                            <!-- Consumos -->
                            <div onclick="navigate('shopping')" class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer space-y-3">
                                <span class="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl inline-block">
                                    <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                </span>
                                <h4 class="font-bold text-sm">🛍️ ¿Necesito Comprar?</h4>
                                <p class="text-xs text-slate-400">Asistente de compras y cables a tierra para domar la culpa o impulsos.</p>
                            </div>

                            <!-- Hábitos -->
                            <div onclick="navigate('habits')" class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer space-y-3">
                                <span class="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl inline-block">
                                    <i data-lucide="activity" class="w-5 h-5"></i>
                                </span>
                                <h4 class="font-bold text-sm">🍷 Hábitos & Consumos</h4>
                                <p class="text-xs text-slate-400">Reducción atómica de alcohol, cigarrillos y control del deseo paso a paso.</p>
                            </div>

                            <!-- Casa Funcional -->
                            <div onclick="navigate('house')" class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer space-y-3">
                                <span class="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl inline-block">
                                    <i data-lucide="home" class="w-5 h-5"></i>
                                </span>
                                <h4 class="font-bold text-sm">🏠 Casa Funcional</h4>
                                <p class="text-xs text-slate-400">Mínimos diarios, temporizador de 15 minutos, despensas y clima.</p>
                            </div>
                        </div>

                        <!-- Emergencia: Modo Mínimo -->
                        <div class="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <span class="p-3 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl">
                                    <i data-lucide="shield-alert" class="w-6 h-6"></i>
                                </span>
                                <div>
                                    <h4 class="font-bold text-slate-900 dark:text-white text-sm">¿Te sientes al límite o abrumado hoy?</h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">Activa el Modo Mínimo para reducir tus tareas a lo verdaderamente crucial para sobrevivir hoy.</p>
                                </div>
                            </div>
                            <button onclick="openModoMinimoModal()" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/10">Activar Modo Mínimo</button>
                        </div>
                    `;

                case 'money':
                    return renderModuloDinero();

                case 'shopping':
                    return renderModuloCompras();
            }
        }

        // --- SUB-RENDERS: DINERO ---
        function renderModuloDinero() {
            const themeColor = state.theme;

            // Render de tarjetas de crédito
            const card = state.card;

            // Deudas
            let deudasHtml = '';
            state.deudas.forEach(d => {
                deudasHtml += `
                    <div class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100">${d.name}</h4>
                            <p class="text-[10px] text-slate-400">Interés: ${d.interest}% • Mínimo: $${d.minPay} • Vence: ${d.dueDate}</p>
                        </div>
                        <div class="text-right flex items-center gap-3">
                            <span class="text-xs font-extrabold text-slate-800 dark:text-white">$${d.balance}</span>
                            <button onclick="deleteDeuda(${d.id})" class="text-slate-400 hover:text-rose-500">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            // Seguros
            let segurosHtml = '';
            state.seguros.forEach(s => {
                segurosHtml += `
                    <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">${s.type}</span>
                            <span class="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[9px] rounded-full font-bold">Activo</span>
                        </div>
                        <div class="text-[10px] text-slate-400 space-y-1">
                            <p><strong>Compañía:</strong> ${s.company} • <strong>Póliza:</strong> ${s.policy}</p>
                            <p><strong>Deducible:</strong> ${s.deductible} • <strong>Vence:</strong> ${s.renewal}</p>
                            <p class="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 mt-1 italic"><strong>Emergencia:</strong> ${s.phone} - "${s.claimSteps}"</p>
                        </div>
                        <button onclick="deleteSeguro(${s.id})" class="text-[9px] text-rose-500 hover:underline">Eliminar seguro</button>
                    </div>
                `;
            });

            return `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Columna principal (Tarjetas y Deudas) -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Tarjetas de Crédito -->
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="credit-card" class="w-5 h-5 text-indigo-500"></i>
                                Mi Tarjeta de Crédito Principal
                            </h3>

                            <form onsubmit="saveCardDetails(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Día de Corte (1 al 31)</label>
                                    <input type="number" id="card-cutoff" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" value="${card.cutoffDay}" required>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Días límite de pago tras corte</label>
                                    <input type="number" id="card-limit" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" value="${card.limitDay}" required>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Saldo para NO generar intereses ($)</label>
                                    <input type="number" id="card-no-interest" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" value="${card.noInterestBalance}" required>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Pago mínimo requerido ($)</label>
                                    <input type="number" id="card-min-pay" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" value="${card.minPay}" required>
                                </div>
                                <div class="sm:col-span-2">
                                    <button type="submit" class="w-full py-2 bg-theme-${themeColor}-600 hover:bg-theme-${themeColor}-700 text-white rounded-xl font-semibold">Guardar Estado de Tarjeta</button>
                                </div>
                            </form>
                        </div>

                        <!-- Control de Deudas -->
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                            <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                                <h3 class="text-base font-bold text-slate-900 dark:text-white">Control de Deudas</h3>
                                <button onclick="openAddDeudaModal()" class="text-xs text-theme-${themeColor}-600 dark:text-theme-${themeColor}-400 font-bold hover:underline">+ Agregar</button>
                            </div>
                            <div class="space-y-2">
                                ${deudasHtml !== '' ? deudasHtml : '<p class="text-xs text-slate-400 text-center py-4">¡Felicidades! No tienes deudas registradas.</p>'}
                            </div>

                            <div class="flex gap-2 pt-2">
                                <button onclick="showDebtStrategy('avalancha')" class="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl">Estrategia Avalancha</button>
                                <button onclick="showDebtStrategy('bola')" class="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl">Estrategia Bola de Nieve</button>
                            </div>
                            <div id="strategy-explanation" class="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-500 leading-relaxed hidden"></div>
                        </div>
                    </div>

                    <!-- Columna lateral (Impuestos y Seguros) -->
                    <div class="space-y-6">
                        <!-- Impuestos -->
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="calculator" class="w-5 h-5 text-emerald-500"></i>
                                Retención de Impuestos
                            </h3>
                            <div class="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs space-y-3">
                                <div class="flex justify-between items-center">
                                    <span>Ingreso mensual:</span>
                                    <strong class="text-slate-700 dark:text-slate-200">$${state.impuestos.monthlyIncome}</strong>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Impuesto estimado (30%):</span>
                                    <strong class="text-emerald-600">$${Math.round(state.impuestos.monthlyIncome * 0.3)}</strong>
                                </div>
                                <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Monto separado actualmente ($)</label>
                                    <input type="number" id="tax-separated" onblur="updateTaxSeparated(this.value)" class="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700" value="${state.impuestos.separatedTax}">
                                </div>
                            </div>
                        </div>

                        <!-- Seguros -->
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                            <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                                <h3 class="text-base font-bold text-slate-900 dark:text-white">Mis Seguros</h3>
                                <button onclick="openAddSeguroModal()" class="text-xs text-theme-${themeColor}-600 dark:text-theme-${themeColor}-400 font-bold hover:underline">+ Agregar</button>
                            </div>
                            <div class="space-y-3">
                                ${segurosHtml !== '' ? segurosHtml : '<p class="text-xs text-slate-400 text-center py-2">No tienes seguros registrados.</p>'}
                            </div>
                        </div>
                    </div>

                    <!-- Modales -->
                    <div id="add-deuda-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden px-4">
                        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
                            <h4 class="font-bold text-base">Añadir Deuda</h4>
                            <form onsubmit="addDeuda(event)" class="space-y-3 text-sm">
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 mb-1">Nombre</label>
                                    <input type="text" id="add-d-name" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" placeholder="Ej. Tarjeta Banamex" required>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Saldo ($)</label>
                                        <input type="number" id="add-d-balance" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Tasa Interés (%)</label>
                                        <input type="number" id="add-d-interest" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Pago Mínimo ($)</label>
                                        <input type="number" id="add-d-min" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Vencimiento</label>
                                        <input type="date" id="add-d-date" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                </div>
                                <div class="flex gap-2 pt-2">
                                    <button type="button" onclick="closeAddDeudaModal()" class="flex-1 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-semibold">Cancelar</button>
                                    <button type="submit" class="flex-1 py-2 bg-theme-${themeColor}-600 text-white rounded-xl font-semibold">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div id="add-seguro-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden px-4">
                        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
                            <h4 class="font-bold text-base">Añadir Seguro</h4>
                            <form onsubmit="addSeguro(event)" class="space-y-3 text-sm">
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 mb-1">Tipo de Seguro</label>
                                    <input type="text" id="add-s-type" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" placeholder="Ej. Seguro de Gastos Médicos" required>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Compañía</label>
                                        <input type="text" id="add-s-comp" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Póliza</label>
                                        <input type="text" id="add-s-policy" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Tel. Siniestros</label>
                                        <input type="text" id="add-s-phone" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 mb-1">Vence</label>
                                        <input type="date" id="add-s-expiry" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700" required>
                                    </div>
                                </div>
                                <div class="flex gap-2 pt-2">
                                    <button type="button" onclick="closeAddSeguroModal()" class="flex-1 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-semibold">Cancelar</button>
                                    <button type="submit" class="flex-1 py-2 bg-theme-${themeColor}-600 text-white rounded-xl font-semibold">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        }

        // --- SUB-RENDERS: COMPRAS CONSCIENTES ---
        function renderModuloCompras() {
            const themeColor = state.theme;
            return `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Asistente "Evaluar Compra" -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <i data-lucide="help-circle" class="w-5 h-5 text-indigo-500"></i>
                            Asistente: Evaluar Gasto / Compra
                        </h3>
                        <p class="text-xs text-slate-400">Antes de gastar en un impulso o tomar una decisión financiera, sigue estas cinco sencillas preguntas:</p>

                        <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-4 text-xs">
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">1. Precio del producto/servicio ($)</label>
                                <input type="number" id="eval-price" oninput="calculateHoursCost()" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" placeholder="Ej. 150">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">2. Tu salario neto por hora trabajada ($)</label>
                                <input type="number" id="eval-hourly" oninput="calculateHoursCost()" class="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value="${state.hourlyWage}">
                            </div>

                            <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white">
                                <span>Costo real en esfuerzo:</span>
                                <span id="eval-hours-result" class="text-indigo-600 dark:text-indigo-400">0 horas de trabajo</span>
                            </div>
                        </div>

                        <!-- Pausa obligatoria basada en precio -->
                        <div class="p-3 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl text-xs text-slate-600 dark:text-slate-300">
                            <strong>Pauta de espera recomendada:</strong>
                            <p id="eval-pause-rule" class="mt-1">Espera 24 horas antes de comprar un objeto menor a $20.</p>
                        </div>
                    </div>

                    <!-- Cable a Tierra (Ansiedad por comprar vs Impulso) -->
                    <div class="space-y-6">
                        <!-- Pantalla contra impulsos -->
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="compass" class="w-5 h-5 text-rose-500"></i>
                                Control de Impulso - Lee esto
                            </h3>
                            <div class="space-y-3.5 text-xs text-slate-500 dark:text-slate-300 italic">
                                <p>"La urgencia que siento por comprar no demuestra que necesite el objeto."</p>
                                <p>"Una oferta no es un ahorro real si no planeaba comprar este artículo."</p>
                                <p>"Puedo desear algo y apreciar su diseño sin tener que poseerlo hoy."</p>
                                <p>"No necesito compensar una emoción incómoda mediante una transacción comercial."</p>
                            </div>

                            <div class="pt-2">
                                <button onclick="triggerTenMinutesReset()" class="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                                    <i data-lucide="timer" class="w-4 h-4"></i> Alternativa de 10 minutos
                                </button>
                                <p id="ten-min-status" class="text-[10px] text-slate-400 text-center mt-2 italic hidden"></p>
                            </div>
                        </div>

                        <!-- Alivio de Ansiedad por Gastos Necesarios -->
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="smile" class="w-5 h-5 text-emerald-500"></i>
                                Culpa al Gastar (Gastos Necesarios)
                            </h3>
                            <p class="text-xs text-slate-400">Si este gasto es necesario (salud, comida, vivienda) pero sientes culpa:</p>
                            <div class="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-2">
                                <p>✔️ <em>"Este gasto no es una falla de carácter, es el mantenimiento de mi vida."</em></p>
                                <p>✔️ <em>"Ahorrar no significa privarse de todo. Significa acumular recursos para usarlos cuando cumplen una función crucial."</em></p>
                                <p>✔️ <em>"Pagar por mi salud, mi descanso, mi seguridad o el mantenimiento preventivo no es desperdiciar dinero."</em></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    </script>
